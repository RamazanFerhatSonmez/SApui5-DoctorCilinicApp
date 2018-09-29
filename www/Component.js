jQuery.sap.require("newProject.Component");
jQuery.sap.require("newProject.MyRouter");
sap.ui.core.UIComponent.extend("newProject.Component", {
    // setting configuration
    metadata: {
        // general part
        name: "newProject",
        version: "1.0.20",
        includes: [],
        dependencies: {
            libs: ["sap.m", "sap.ui.layout"],
            components: []
        },
        config: {
            resourceBundle: "i18n/messageBundle.properties",
        },
        routing: {
            config: {
                routerClass: sap.ui.demo.app.MyRouter,
                viewType: "XML",
                targetAggregation: "pages",
                clearTarget: false
            },
            routes:[ {
                pattern: "",
                viewPath: "newProject.view",
                name: "Main",
                view: "Main",
                targetControl: "appViewid",
                transition: "show",
                
            },{
                 pattern: "DoctorHastaList",
                 viewPath: "newProject.view",
                 name: "DoctorHastaList",
                 view: "DoctorHastaList",
                 targetControl: "appViewid",
                 transition: "show",
             } ]
        }
    },
    init: function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var mConfig = this.getMetadata().getConfig();
        this.getRouter().initialize();
    },
    createContent: function() {
        var oViewData = {
            component: this
        };
        return sap.ui.view({
            viewName: "newProject.App",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: oViewData
        });
    }
});