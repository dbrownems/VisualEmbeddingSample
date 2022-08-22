

$(async function () {

    let response = await fetch("/visuals.json");

    let visualsToEmbed = await response.json();


    //console.log(JSON.stringify(visualsToEmbed));
    var visualsContainer = document.getElementById('visualsContainer');

    //create divs for the visuals and kick-off the bootstraping
    for (let v of visualsToEmbed) {

        let div = document.createElement('div');
        v.targetElement = div;

        for (let c of v.cssClass) {
            div.classList.add(c);
        }

        visualsContainer.appendChild(div);

        powerbi.bootstrap(div, { type: "visual", hostname: globals.powerBiHostname });
    }

    //kick off all the embeddings then wait for them to complete
    {
        let promises = [visualsToEmbed.length];
        for (let i = 0; i < visualsToEmbed.length; i++) {
            let v = visualsToEmbed[i].targetElement;

            let config = visualsToEmbed[i].embedConfig;
            promises[i] = embedVisual(config, v);
        }
        for (let i = 0; i < visualsToEmbed.length; i++) {
            let visual = await promises[i];
            visualsToEmbed[i].visual = visual;
        }
    }
    
    //wire up cross-filtering
    for (let thisVisual of visualsToEmbed) {
        if (thisVisual.producesFiltersOn == null) {
            continue;
        }


        console.log("Wiring up cross-filter");
                //wire up events
        thisVisual.visual.on("dataSelected", async function (event) {
            let filterTargetVisuals = [];

            //hide the captured thisVisual and find the visual that triggered the event
            let thisVisual;
            for (let v of visualsToEmbed) {

                if (v.targetElement == event.srcElement) {
                    thisVisual = v;
                    break;
                }
            }
            if (thisVisual == null) {
                throw new Error('Event target visual not found');
            }

            for (let otherVisual of visualsToEmbed) {

                if (otherVisual.targetElement == event.srcElement) {
                    continue;
                }

                for (let af of otherVisual.acceptsFiltersOn) {
                    if (af.tableName == thisVisual.producesFiltersOn.tableName
                        && af.columnName == thisVisual.producesFiltersOn.columnName) {

                        filterTargetVisuals.push(otherVisual);
                    }
                }
            }
            if (filterTargetVisuals.length == 0) {
                return;
            }
            for (let otherVisual of filterTargetVisuals) {
                let newFilters = [];
                let filters = await otherVisual.visual.getFilters(2);//Visual=2
                for (let f of filters) {
                    //preserve any filters on other columns or any non-basic filters
                    if (f.filterType != 1 || f.target.table != thisVisual.producesFiltersOn.tableName || f.target.column != thisVisual.producesFiltersOn.columnName) {
                        newFilters.push(f);
                    }
                }

                if (event.detail.dataPoints.length > 0) {
                    let values = [];
                    for (let dataPoint of event.detail.dataPoints) {
                        values.push(dataPoint.identity[0].equals);
                    }

                    let newFilter = {
                        $schema: "http://powerbi.com/product/schema#basic",
                        target: {
                            table: thisVisual.producesFiltersOn.tableName,
                            column: thisVisual.producesFiltersOn.columnName
                        },
                        operator: "In",
                        values: values,
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