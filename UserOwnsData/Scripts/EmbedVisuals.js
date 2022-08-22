

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

    //kick off all the embeddings
    {
        let promises = [visualsToEmbed.length];
        for (var i = 0; i < visualsToEmbed.length; i++) {
            var v = visualsToEmbed[i].targetElement;

            var config = visualsToEmbed[i].embedConfig;
            promises[i] = embedVisual(config, v);
        }
        for (var i = 0; i < visualsToEmbed.length; i++) {
            var visual = await promises[i];
            visualsToEmbed[i].visual = visual;
        }
    }
    
    //wire up cross-filtering
    for (var i = 0; i < visualsToEmbed.length; i++) {
        var thisVisual = visualsToEmbed[i];
        if (thisVisual.producesFiltersOn == null) {
            continue;
        }


        console.log("Wiring up cross-filter");
                //wire up events
        thisVisual.visual.on("dataSelected", async function (event) {
            let filterTargetVisuals = [];

            //hide the captured thisVisual and find the visual that triggered the event
            var thisVisual;
            for (var i = 0; i < visualsToEmbed.length; i++) {

                if (visualsToEmbed[i].targetElement == event.srcElement) {
                    thisVisual = visualsToEmbed[i];
                    break;
                }
            }
            if (thisVisual == null) {
                throw new Error('Event target visual not found');
            }

            for (var j = 0; j < visualsToEmbed.length; j++) {

                let otherVisual = visualsToEmbed[j];
                if (otherVisual.targetElement == event.srcElement) {
                    continue;
                }

                for (var k = 0; k < otherVisual.acceptsFiltersOn.length; k++) {
                    let af = otherVisual.acceptsFiltersOn[k];
                    if (af.tableName == thisVisual.producesFiltersOn.tableName && af.columnName == thisVisual.producesFiltersOn.columnName) {
                        filterTargetVisuals.push(otherVisual);
                    }
                }
            }
            if (filterTargetVisuals.length == 0) {
                return;
            }
            for (var k = 0; k < filterTargetVisuals.length; k++) {
                let otherVisual = filterTargetVisuals[k];
                //let af = otherVisual.acceptsFiltersOn[k];
                let newFilters = [];
                let filters = await otherVisual.visual.getFilters(2);//Visual=2
                for (var i = 0; i < filters.length; i++) {
                    let f = filters[i];

                    //preserve any filters on other columns or any non-basic filters
                    if (f.filterType != 1 || f.target.table != thisVisual.producesFiltersOn.tableName || f.target.column != thisVisual.producesFiltersOn.columnName) {
                        newFilters.push(f);
                    }
                }
                if (event.detail.dataPoints.length > 0) {

                    var value = event.detail.dataPoints[0].identity[0].equals;
                    var newFilter = {
                        $schema: "http://powerbi.com/product/schema#basic",
                        target: {
                            table: thisVisual.producesFiltersOn.tableName,
                            column: thisVisual.producesFiltersOn.columnName
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