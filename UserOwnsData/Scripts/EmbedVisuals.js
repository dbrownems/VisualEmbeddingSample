

$(async function () {

    var visualsToEmbed = [
        {
            embedConfig: {
                workspaceId: "4824796f-d801-44b9-b761-9572a2a83232",
                reportId: "79986161-b099-49eb-917d-ce5fee053bf8",
                pageName: "ReportSectiondecccb8482fa6cf4f797",
                visualName: "e16ff33d4f17123d49e6"
            }
            , cssClass: ["grid-item", "span1x1"]
            //,acceptsFiltersOn: [{tableName:"", columnName:""}]
            //,producesFiltersOn: { tableName: "", columnName: "" } 
            , targetElement : null
        },
        {
            embedConfig: {
                workspaceId: "4824796f-d801-44b9-b761-9572a2a83232",
                reportId: "79986161-b099-49eb-917d-ce5fee053bf8",
                pageName: "ReportSectiondecccb8482fa6cf4f797",
                visualName: "b1e05f643b3140d6e9fa"
            }
            , cssClass: ["grid-item", "span1x1"]
            //,acceptsFiltersOn: [{tableName:"", columnName:""}]
            //,producesFiltersOn: { tableName: "", columnName: "" } 
            , targetElement : null
        },
        {
            embedConfig: {
                workspaceId: "bf695c3f-4374-4308-9a33-aaaa5b2a27ff",
                reportId: "450f8d4f-c36c-4a92-b1fa-b071e8cffe2d",
                pageName: "ReportSection",
                visualName: "99efdd0a9b0cb5c3a54c"
            }
            ,cssClass: ["grid-item","span4x2"]
            ,acceptsFiltersOn: [{tableName:"DimDate", columnName:"FiscalYear"}]
            //,producesFiltersOn: { tableName: "", columnName: "" } 
            ,targetElement : null
        },
        {
            embedConfig: {
                workspaceId: "bf695c3f-4374-4308-9a33-aaaa5b2a27ff",
                reportId: "450f8d4f-c36c-4a92-b1fa-b071e8cffe2d",
                pageName: "ReportSection",
                visualName: "ae13b51fe02dcd05dc77"
            }
            ,
            cssClass: ["grid-item", "span4x2"]
            //, acceptsFiltersOn: [{ tableName: "DimDate", columnName: "FiscalYear" }]
            , producesFiltersOn: { tableName: "DimDate", columnName: "FiscalYear" } 
            , targetElement : null
        }
    ]

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

        //visual.on("dataSelected", function (event) {
        //    var column = event.detail.dataPoints[0].identity[0].target.column;
        //    var table = event.detail.dataPoints[0].identity[0].target.table;
        //    var value = event.detail.dataPoints[0].identity[0].equals;

        //    for (var i = 0; i < visualsToEmbed.length; i++) {
        //        if (v.config.visualName == event.detail.visual.name) {
        //            continue;
        //        }


        //    }
        //    embeddedVisuals.forEach(async function (v) {
        //        if (v.config.visualName != event.detail.visual.name) {
                
        //            var filtersToKeep = [];
        //            var filters = await v.getFilters();
        //            filters.forEach(function (f) {
        //                if (f.target.table != table) {
        //                    filtersToKeep.push(f);
        //                }
        //            });

        //            var newFilter = {
        //                $schema: "http://powerbi.com/product/schema#basic",
        //                target: {
        //                    table: table,
        //                    column: column
        //                },
        //                operator: "In",
        //                values: [value],
        //                filterType: 1,
        //                requireSingleSelection: true
        //            };
        //            filtersToKeep.push(newFilter);

        //            v.setFilters(filtersToKeep);
        //        };
                
        //    });
        //    console.log(event.detail);
        //});
    }
    // Initialize event handlers
    //initializeEventHandlers();


    // Apply bootstrap to report, dashboard, and tile containers
    //powerbi.bootstrap(globals.reportContainer.get(0), { type: "report", hostname: globals.powerBiHostname });
    //powerbi.bootstrap(globals.dashboardContainer.get(0), { type: "dashboard", hostname: globals.powerBiHostname });
    //powerbi.bootstrap(globals.tileContainer.get(0), { type: "tile", hostname: globals.powerBiHostname });


});