var config = {
    host: 'bi.cerpba.int',
    prefix: '/',
    port: 80,
    isSecure: false
};
require.config( {
    baseUrl: ( config.isSecure? "https://" : "http://" ) + config.host + (config.port? ":" + config.port: "") + config.prefix + "resources"
});
var qlikApps = [];
require(["js/qlik"], function ( qlik ){
    qlik.setOnError(function(error) {
        alert(error.message);
    });
    function attach(elem){
        var appid = elem.dataset.qlikAppid;
        var objid = elem.dataset.qlikObjid;
        var app = qlikApps[appid];
        if (!app){
            app = qlik.openApp(appid, config);
            debugger;
            qlikApps[appid] = app;
        }
        if (!objid.includes("QV")) app.getObject(elem, objid);
        else {
            //app.visualization.create(
            //    'barchart',
            //    [
            //        "Annee",
            //        "=SUM(Ventes.QuantiteFacturee)"
            //    ],
            //    {
            //        "showTitles": true,
            //        "title": "Quantité vendue par mois"
            //    }
            //).then(function (vis) {
            //    vis.show(objid);
            //});
            app.visualization.create(
                'table',
                [
                    {
                        "qDef": {
                            "qFieldDefs": [
                                "=%CODESI"
                            ],
                            "qFieldLabels": [
                                "%CODESI"
                            ],
                            "qSortCriterias": [
                                {
                                    "qSortByLoadOrder": 1
                                }
                            ]
                        },
                        "qNullSuppression": true
                    },
                    {
                        "qDef": {
                            "qFieldDefs": [
                                "=%SOURCE"
                            ],
                            "qFieldLabels": [
                                "%SOURCE"
                            ],
                            "qSortCriterias": [
                                {
                                    "qSortByLoadOrder": 1
                                }
                            ]
                        },
                        "qNullSuppression": true
                    },
                    {
                        "qDef": {
                            "qFieldDefs": [
                                "=Annee"
                            ],
                            "qFieldLabels": [
                                "Annee"
                            ],
                            "qSortCriterias": [
                                {
                                    "qSortByLoadOrder": 1
                                }
                            ]
                        },
                        "qNullSuppression": true
                    },
                    {
                        "qDef": {
                            "qFieldDefs": [
                                "=Mois",
                            ],
                            "qFieldLabels": [
                                "Mois"
                            ],
                            "qSortCriterias": [
                                {
                                    "qSortByLoadOrder": 1
                                }
                            ]
                        },
                        "qNullSuppression": true
                    },
                    {
                        "qDef": {
                            "qLabel": "CaBrut",
                            "qDef": "Sum(Ventes.CaBrut)",
                            "qNumFormat": {
                                "qType": "M",
                                "qnDec": 2,
                                "qUseThou": 0,
                                "qFmt": "# ##0,00 €;-# ##0,00 €",
                                "qDec": ",",
                                "qThou": " "
                            }
                        },
                    },
                    {
                        "qDef": {
                            "qLabel": "Quantité facutrée",
                            "qDef": "Sum(Ventes.QuantiteFacturee)",
                            "qNumFormat": {
                                "qType": "M",
                                "qnDec": 2,
                                "qUseThou": 0,
                                "qFmt": "# ##0,00 €;-# ##0,00 €",
                                "qDec": ",",
                                "qThou": " "
                            }
                        }
                    },
                    {
                        "qDef": {
                            "qLabel": "Quantité manquée",
                            "qDef": "Sum(VentesManquees.Quantite)",
                            "qNumFormat": {
                                "qType": "M",
                                "qnDec": 2,
                                "qUseThou": 0,
                                "qFmt": "# ##0,00 €;-# ##0,00 €",
                                "qDec": ",",
                                "qThou": " "
                            }
                        }
                    },
                            
                ],
                {
                    "title": "My title",
                    //"subtitle": "My subtitle",
                    //"footnote": "My footnote"
                }
            ).then(function (vis) {
                vis.show(objid);
            });

            /*app.getFullPropertyTree(value.qInfo.qId).then(function(model){
alert(model.propertyTree.qChildren.length + ' children');
});*/
        }
    }
    var elems = document.getElementsByClassName('qlik-embed');
    var ix = 0;
    for (; ix < elems.length; ++ix){
        attach(elems[ix]);
    }
});     