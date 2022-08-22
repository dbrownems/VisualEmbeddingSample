

$(async function () {

    let response = await fetch("/visuals.json");

    var visualsToEmbed = await response.json();


    console.log(JSON.stringify(visualsToEmbed));
    var visualsContainer = document.getElementById('visualsContainer');

    for (var i = 0; i < visualsToEmbed.length; i++) {
        var v = visualsToEmbed[i];
        let div = document.createElement('div');

        for (var j = 0; j < v.cssClass.length; j++) {
            div.classList.add(v.cssClass[j]);
        }
         
        v.targetElement = div;

        powerbi.bootstrap(div, { type: "visual", hostname: globals.powerBiHostname });
        visualsContainer.appendChild(div);
    }

  
    for (var i = 0; i < visualsToEmbed.length; i++) {
        var v = visualsToEmbed[i].targetElement;

        var config = visualsToEmbed[i].embedConfig;
        var visual = await embedVisual(config, v);
        visualsToEmbed[i].visual = visual;
    }

    for (var i = 0; i < visualsToEmbed.length; i++) {
        var thisVisual = visualsToEmbed[i];
        if (thisVisual.producesFiltersOn == null) {
            continue;
        }

        var filterTargetVisuals = [];
        for (var j = 0; j < visualsToEmbed.length; j++) {
            if (j == i) {
                continue;
            }
            var otherVisual = visualsToEmbed[j];
            
            for (var k = 0; k < otherVisual.acceptsFiltersOn.length; k++) {
                var af = otherVisual.acceptsFiltersOn[k];
                if (af.tableName == thisVisual.producesFiltersOn.tableName && af.columnName == thisVisual.producesFiltersOn.columnName) {
                    filterTargetVisuals.push(otherVisual);
                }
            }
        }
        if (filterTargetVisuals.length == 0) {
            continue;
        }

        console.log("Wiring up cross-filter");
                //wire up events
        thisVisual.visual.on("dataSelected", async function (event) {
            for (var k = 0; k < filterTargetVisuals.length; k++) {
                var otherVisual = filterTargetVisuals[k];
                var newFilters = [];
                var filters = await otherVisual.visual.getFilters(2);//Visual=2
                for (var i = 0; i < filters.length; i++) {
                    var f = filters[i];

                    //preserve any filters on other columns or any non-basic filters
                    if (f.filterType != 1 || f.target.table != af.tableName || f.target.column != af.columnName) {
                        newFilters.push(f);
                    }
                }
                if (event.detail.dataPoints.length > 0) {

                    var value = event.detail.dataPoints[0].identity[0].equals;
                    var newFilter = {
                        $schema: "http://powerbi.com/product/schema#basic",
                        target: {
                            table: af.tableName,
                            column: af.columnName
                        },
                        operator: "In",
                        values: [value],
                        filterType: 1,
                        requireSingleSelection: true
                    };
                    newFilters.push(newFilter);

                }

                otherVisual.visual.updateFilters(1, newFilters) //ReplaceAll=1
                    .catch(errors => {
                        console.log(errors);
                    });

            }
        });
 
    }
 
});