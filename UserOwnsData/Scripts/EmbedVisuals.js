$(function () {



    var visualDivs = document.getElementById('visualsContainer').children;
    for (var i = 0; i < visualDivs.length; i++) {
        var visualDiv = visualDivs[i];

        var v = visualDiv;
        var embedParam = {
            workspaceId: v.getAttribute("data-workspaceId"),
            reportId: v.getAttribute("data-reportId"),
            pageName: v.getAttribute("data-pageName"),
            visualName: v.getAttribute("data-visualName")
        };
        embedVisual(embedParam, visualDiv);
    }
    // Initialize event handlers
    //initializeEventHandlers();


    // Apply bootstrap to report, dashboard, and tile containers
    //powerbi.bootstrap(globals.reportContainer.get(0), { type: "report", hostname: globals.powerBiHostname });
    //powerbi.bootstrap(globals.dashboardContainer.get(0), { type: "dashboard", hostname: globals.powerBiHostname });
    //powerbi.bootstrap(globals.tileContainer.get(0), { type: "tile", hostname: globals.powerBiHostname });


});