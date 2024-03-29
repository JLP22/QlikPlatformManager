/**
 * START
*/
//var global_serveur = serveurProd;
//Variables globales
//Définition du serveur source Qlik pour accès ressource css, js,...
console.log("util.js : start");

//var serveurDev = "http://bi.cerpba.int";
//var serveurProd = "http://bi.cerpba.com";
var _serveur = [
    { protocol: "http://", host: "srv99bi", isServeurDev: true },
    { protocol: "http://", host: "srv02bi", isServeurDev: false }
];

//Ticket : Vérification cache et demande si nécessaire
_serveur.forEach(function (serv) {
    var cacheTicket = sessionStorage.getItem("ticket_" + serv.host);
    console.log("util.js : ticket du " + serv.host + " -> " + cacheTicket);
    if (!cacheTicket || cacheTicket === "null" || cacheTicket === null) InitQlikTicket(serv);
});


/**
 * END
*/


/**
 * Gestion des infobulles
 * @method
 * @memberof Mine.Utils
 */
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
/**
 * Avant soumission du formulaire Ajax
 * @method
 * @memberof Mine.Utils
 */
function OnBegin(sender) {
    $("#ActionStateSpr")[0].style.display = '';
    $("#ActionStateBtn").attr("disabled", true);
    $("#" + sender.id + " :input").attr("disabled", true);
}
/**
 * Gestion du style du bouton de soumission du formulaire AJAX (après soumission)
 * @method
 * @memberof Mine.Utils
 */
function OnComplete() {

    $("#ActionStateSpr")[0].style.display = 'none';
    $("#ActionStateBtn").attr("disabled", false);
    if ($("#ResultsTitle").text().includes("OK")) {
        $("#Results").attr("class", "alert alert-success");
    }
    //Affichage des infobulles si nécessaire (champs select et spans associés)
    SetSpanTitle();
}
/**
 * Gestion du style du bouton de soumission du formulaire AJAX (après soumission et erreur)
 * @method
  * @memberof Mine.Utils
 */
function OnFailure() {
    //$("#ArchivageApplicationDiv").html("Une erreur s'est produite lors de la recherche, veuillez réessayer ...");
    $("#ActionStateSpr")[0].style.display = 'none';
    $("#ActionStateBtn").attr("disabled", false);
    alert("erreur yop");
}
/**
 * Action avant la soumission du formulaire
 * @method
 * @memberof Mine.Utils
 */
function OnClicExport(prefixeServeur, sender, idCbAttach) {

    var prefix = prefixeServeur + "_Connexion";

    var idServeurSelect = prefix + "_Serveur_Select";
    var idFluxSelect = prefix + "_Flux_Select";
    var idApplicationSelect = prefix + "_Application_Select";

    //Si Serveur + flux + application valorisé
    if ($("#" + idServeurSelect + " option:selected").text() != ""
        && $("#" + idFluxSelect + " option:selected").text() != ""
        && $("#" + idApplicationSelect + " option:selected").text() != "") {

        //Envoi du formulaire
        //Désactivation des règles de validation des champs de l'autre serveur
        //Désactivation des règles de validation des champs de l'autre serveur
        ActivateClientValidation("Serveur", "remove", sender.id);
        ActivateClientValidation("Flux", "remove", sender.id);
        ActivateClientValidation("Application", "remove", sender.id);

        //Cocher la cb associée
        $("#" + idCbAttach).prop("checked", true);

        var formObject = $("#" + sender.id).closest('form');
        formObject.submit(function (e) {
            e.preventDefault(); // stop the standard form submission
            $.ajax({
                url: "/Archiver/Export",
                type: this.method,
                data: $(this).serialize(),
                beforeSend: function (jqXHR, settings) {
                    OnBegin(formObject[0]);
                },
                success: function (result) {
                    $("#ContentDiv").html(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#ContentDiv").html("erreur : " + jqXHR.statusText + "<br/>" + jqXHR.responseText + "<br/>" + textStatus + "<br/>" + errorThrown);
                    OnFailure();
                },
                complete: function (jqXHR, textStatus) {
                    //alert("jqXHR = " + jqXHR.statusText + "\n" + jqXHR.responseText + "textStatus = " + textStatus);
                    OnComplete();
                    $("#" + idCbAttach).prop("checked", false);
                }
            });
            return false; // stop the standard form submission
        });

        //Réactivation des règles de validation des champs de l'autre serveur /!\ Avoir si nécessaire
        ActivateClientValidation("Flux", "add", sender.id);
        ActivateClientValidation("Application", "add", sender.id);
        ActivateClientValidation("Serveur", "add", sender.id);
    }
}
/**
 * Affichage des span correspondant au Select d'un serveur, flux ou application
 * @method
  * @memberof Mine.Utils
 */
function SetSpanTitle() {
    //Pour chaque select de la page
    $("select").each(function (index) {
        var idSelect = this.id;
        var idSpan = idSelect.replace("_Select", "_Span");
        //Si Select d'un serveur ou d'un flux
        if (idSelect.indexOf("Serveur_Select") >= 0 || idSelect.indexOf("Flux_Select") >= 0) {
            //Si renseigné, Affichage coche
            if ($("#" + idSelect + " option:selected").text() != "") $("#" + idSpan)[0].style.display = '';
            //alert("Affichage span " + idSpan);

        }
        //Cas Select d'application
        else if (idSelect.indexOf("Application_Select") >= 0) {
            //Si renseigné et résultat du post du formulaire OK

            //if ($("#" + idSelect + " option:selected").text() != "" && $("#ResultsTitle").text().includes("OK")) {
            if ($("#" + idSelect + " option:selected").text() != "") {
                //Alimente infobulle
                SetApplicationTitle("#" + idSelect, "#" + idSpan);
                //Affichage coche
                $("#" + idSpan)[0].style.display = '';
                //alert("Affichage span " + idSpan);
            }
        }
        //console.log(index + ": " + $(this).text());
        //alert(index + ": " + this.id);
    });
}
/**
 * Evènement déclenché sur la modification de valeur de la liste modele (Tester/Donnees)
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function OnChangeSelectModele(sender) {

    var currentSelectedValue = $("#" + sender.id + " option:selected").text();
    //Selection d'un modele
    if (currentSelectedValue != "") {
        //RAZ des CB selection applications
        var elems = document.getElementsByName("SelectedApplications");
        for (var i = 0; i < elems.length; i++) {
            $("#" + elems[i].id).prop("checked", false)
        }
        $("#SelectedApplications").val(null);

        //Envoi formulaire avec désactivation de la validation sur CB Application
        $("#SelectedApplications").rules("remove", "required");
        $("#" + sender.id).closest('form').submit();
        $("#SelectedApplications").rules("add", "required");
    }
}

/**
 * Evènement déclenché sur la modification de valeur d'un champ liste
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function OnChangeSelect(sender) {

    var currentSelectedValue = $("#" + sender.id + " option:selected").text();
    var currentIdRacine = sender.id.replace("_Select", "");

    var suffixSelect = "_Select";
    var suffixSpan = "_Span";

    var prefix = sender.id.substr(0, sender.id.replace(suffixSelect, "").lastIndexOf("_") + 1);
    var idServeur = prefix + "Serveur";
    var idFlux = prefix + "Flux";
    var idApplication = prefix + "Application";


    var idServeur_Select = idServeur + suffixSelect;
    var idFlux_Select = idFlux + suffixSelect;
    var idApplication_Select = idApplication + suffixSelect;

    var idApplication_Span = idApplication + suffixSpan;

    //Selection d'un serveur
    if (sender.id == idServeur_Select) {

        //RAZ des autres select
        RazSelect(idFlux, true);
        RazSelect(idApplication, true);

        //Serveur valorisé
        if (currentSelectedValue != "") {

            //Envoi du formulaire
            //Cas particulier si plusieurs serveurs sur la page désactive la validation des autres
            ActivateClientValidation("Serveur", "remove", sender.id);
            ActivateClientValidation("Flux", "remove", sender.id);
            ActivateClientValidation("Application", "remove", sender.id);

            $("#" + sender.id).closest('form').submit();
            ActivateClientValidation("Flux", "add", sender.id);
            ActivateClientValidation("Application", "add", sender.id);
            ActivateClientValidation("Serveur", "add", sender.id);

        } else {
            //RAZ select modifié si non valorisé
            RazSelect(currentIdRacine, false);
        }
    }
    //Selection d'un flux
    else if (sender.id == idFlux_Select) {

        //RAZ du select suivant
        RazSelect(idApplication, true);

        //Serveur valorisé
        if (currentSelectedValue != "") {

            //Envoi du formulaire
            //Cas particulier si plusieurs serveurs sur la page désactive la validation des autres
            ActivateClientValidation("Serveur", "remove", sender.id);
            ActivateClientValidation("Flux", "remove", sender.id);
            ActivateClientValidation("Application", "remove", sender.id);
            $("#" + sender.id).closest('form').submit();
            ActivateClientValidation("Application", "add", sender.id);
            ActivateClientValidation("Flux", "add", sender.id);
            ActivateClientValidation("Serveur", "add", sender.id);

        } else {
            //RAZ select modifié si non valorisé
            RazSelect(currentIdRacine, false);
        }
    }
    //Selection d'une application
    else if (sender.id == idApplication_Select) {

        //Affichage coche de validation pour application si selectionnée
        if (currentSelectedValue != "") {

            //Alimentation de la balise title et affichage de la coche
            SetApplicationTitle("#" + idApplication_Select, "#" + idApplication_Span);
            $("#" + idApplication_Span)[0].style.display = '';

        } else {
            //RAZ select modifié si non valorisé
            RazSelect(currentIdRacine, false);
        }
    }
}
/**
 * Vide le champs type select et cache le span associe
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function RazSelect(idElementApplication, toEmpty) {
    $("#" + idElementApplication + "_Select option:eq(0)").prop('selected', true);
    if (toEmpty) {
        $("#" + idElementApplication + "_Select").find('option').remove().end().append('<option value=" "></option>').val(' ');
    }
    $("#" + idElementApplication + "_Span")[0].style.display = 'none';
}
/**
 * Modifie la validation du champs select et de son cousin (cas plusieurs connexion dans la page)
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function ActivateClientValidation(selectType, action, originElementId) {

    //Modification de la validation 
    //Parcours de tous les champs select de la page
    $("select").each(function (index) {

        //Si Select du bon type (ex: serveur, flux ou application)
        if (this.id.indexOf(selectType) >= 0 && this.id != originElementId) {

            //MAJ validation cliente
            $("#" + this.id).rules(action, "required");
            //alert("Validation de type " + action + " pour " + this.id);

        }
    });
}
/**
 * Alimente l'infobulle avec les information de l'application sélectionnée
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function SetApplicationTitle(idElementApplication, idElementApplicationSpan) {

    var newTitle = GetinfosApplicationTitle(idElementApplication);
    //alert("newTitle = " + newTitle);
    //$(idElementApplicationSpan).prop('title', newTitle); // En commentaire sinon ajoute infobulle std par dessus
    if (newTitle != "") $(idElementApplicationSpan).attr("data-original-title", newTitle);
}
/**
 * Retourne la chaine à afficher dans l'infobulle
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function GetinfosApplicationTitle(idElementApplication) {
    //Rechercher info pour infobulle de l'application sélectionnée'
    var infosApplicationTitle = "";
    //var _infosApplication = ""; //@Html.Raw(Json.Encode(Model.ApplicationsInfos));

    /*for (app in _infosApplication) {
        //alert($(idElementApplication + " option:selected").text() + " >>>> " + app);
        if (app == $(idElementApplication + " option:selected").text()) {
            infosApplicationTitle = _infosApplication[app];
            break;
        }
    }*/
    infosApplicationTitle = $(idElementApplication.replace("_Select", "_Infos")).val($(idElementApplication + " option:selected").text());
    infosApplicationTitle = $(idElementApplication.replace("_Select", "_Infos") + " option:selected").text();
    return infosApplicationTitle;
}

/**
 * Alerte si l'élément est obligatoire ou non
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function alertIfRequired(element) {

    var rules = $(element).rules();
    if (rules) {
        var isReq = findProperty(rules, 'required');
    }

    var estObligatoire = " n'est pas obligatoire";
    if (isReq) estObligatoire = " est obligatoire";

    alert(element + estObligatoire);
}
/**
 * Recherche d'une propriété dans une liste
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} liste 
 * @argument {Eement} propriété
 */
function findProperty(obj, key) {

    if (typeof obj === "object") {
        if (key in obj) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}
/**
 * Fonction de test et capitalisation de code
 * @method
 * @memberof Mine.Utils
 */
function CallChangefunc(val) {
    //window.location.href = "/Controller/Actionmethod?value=" + val;
    //$("#myselect option:selected").text();
    //$("div.id_100 select").val("val2");
    //$("#fluxSource").val("Unknown");
    //$("#fluxSource").val("1");
    /*alert($("#serveurSource").val());
    alert($("#fluxSource").val());
    alert($("#applicationSource").val());*/
    //$('#formId').valid()

    //document.form0 = "Archiver/Application";

    //$("#ActionStateBtn").attr("class", "cancel");
    //$("#form0").validate();
    //$("#ActionStateBtn").submit()
    //$(ActionStateBtn).click();

    //var f = $(sender).closest('form');
    //$('input, select, textarea').each(function () {
    //    $(this).rules('remove', 'required');
    //});
    ////f.find('select').rules('remove');
    //f.append('<input type="hidden" name="command" value="' + command + '" />');

    //if (f.attr("formnovalidate") != undefined) {
    //    validator.cancelSubmit = true;
    //}

    //f.submit();

    //var f = $("#form0");
    //f.append('<input type="hidden" name="command" value="' + command + '" />');
    //f.submit();
    //alert("toto");
    //$("#ActionStateBtn").attr("class", "cancel");
    //alert("toto2");
    //f.submit();
    //alert("toto3");
    //$("#noValidate").append("@{ Html.EnableClientValidation(false); }");

    var form = $("#form0");
    alert("toto");
    preventDefault();
    if (form.valid()) {
        form.submit();
    }

}

function Connect2Servers(pObjectOTF) {
    debugger;
    var objetId = '';

    objetId = "qa-Ventesclient(dev)";
    if (document.getElementById(objetId) != null) FillQlikVizu('SRV99BI', 'f68ea504-73c1-4de1-ab39-e10f35be4d81', objetId, pObjectOTF);

    objetId = "qa-Ventesclient(recette)";
    if (document.getElementById(objetId) != null) FillQlikVizu('SRV02BI', '70504359-6226-4334-a146-98c35824012f', objetId, pObjectOTF);
}


function FillQlikVizu(qlikServer, qlikAppName, htmlObjId, qlikObjectOTF) {

    var qlikAppId = "";
    debugger;

    var qlikObjectJsonDataset = JSON.parse(qlikObjectOTF);

    var config = {
        host: qlikServer,
        prefix: '/',
        port: 80,
        isSecure: false
    };
    require.config({baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"});

    require(["js/qlik"], function (qlik) {

        qlik.setOnError(function (error) {
            alert(error.message);
        });

        qlik.getAppList(function (list) {
            /*var str = "";
            list.forEach(function (value) {
                str += value.qDocName + '(' + value.qDocId + ') ';
            });
            alert(str);*/
            
            qlikAppId = list.find(function (element) { return element.qDocName == qlikAppName }).qDocId;
            debugger;

            app = qlik.openApp(qlikAppId, config);
            app.visualization.create(
                'table',
                qlikObjectJsonDataset

            ).then(function (vis) {
                vis.show(htmlObjId);
            });
            qlik = null;

        }, config);

        

    });

}

function FillAllQlikVizu(qlikObjectOTF) { 

    //Récupère tous les element html à remplir par un objet qlik
    var htmlElems = document.getElementsByClassName('qlik-embed');
    if (htmlElems.length > 0) {

        var qlikObjectJsonDataset = JSON.parse(qlikObjectOTF);
        var _host = [];
        var iServer = 0;
       
        //Création d'un tableau des elements html à remplir par serveur
        for (i = 0; i < htmlElems.length; i++) {

            //Identifie serveur et application qlik + id de l'element html à remplir
            var qlikObjInfo = {
                qlikServer : htmlElems[i].dataset.qlikHost,
                qlikAppName : htmlElems[i].dataset.qlikAppname,
                htmlObjId : htmlElems[i].id
            };

            var isModifiedServer = (i > 0 && qlikObjInfo.qlikServer != htmlElems[i - 1].dataset.qlikHost);

            //Si nouveau serveur
            if (i == 0 || isModifiedServer) {
                if (i > 0) iServer++;
                _host[iServer] = [];
            }
            _host[iServer].push(qlikObjInfo);
        }
            
        //Par serveur
        for (i = 0; i < _host.length; i++) {
            (function (local_iHost) {
                var qlikServer = local_iHost[0].qlikServer;
                console.log("Serveur = " + qlikServer);
                var config = {
                    host: qlikServer,
                    prefix: '/',
                    port: 80,
                    isSecure: false
                };
                require.config({ baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources" });
                //debugger;
                require(["js/qlik"], function (qlik) {

                    qlik.setOnError(function (error) {
                        alert(error.message);
                    });

                    qlik.getAppList(function (list) {
                        //debugger;

                        //Par application du serveur
                        for (j = 0; j < local_iHost.length; j++) {
                            console.log("ForApplication = " + local_iHost[j].qlikServer);
                            (function (l_qlik ,local_iApp) {

                                //debugger;
                                var qlikAppName = local_iApp.qlikAppName;
                                var htmlObjId = local_iApp.htmlObjId;
                                var qlikAppId = list.find(function (element) { return element.qDocName == qlikAppName }).qDocId;
                                console.log("Application = " + qlikAppName);
                                console.log("Attacher " + htmlObjId + " : (Serveur) " + qlikServer + " (App) " + qlikAppName + " (AppId) " + qlikAppId + " (Modified) ");
                                var app = l_qlik.openApp(qlikAppId, config);

                                (function (l_app, l_htmlObjId, l_qlikServer, l_qlikAppName, l_qlikAppId, l_isModifiedServer) {
                                    console.log("Create " + l_htmlObjId + " : (Serveur) " + l_qlikServer + " (App) " + l_qlikAppName + " (AppId) " + l_qlikAppId + " (Modified) ");
                                    l_app.visualization.create(
                                        'table',
                                        qlikObjectJsonDataset

                                    ).then(function (vis) {
                                        console.log("vis " + l_htmlObjId + " : (Serveur) " + l_qlikServer + " (App) " + l_qlikAppName + " (AppId) " + l_qlikAppId + " (Modified) ");
                                        vis.show(l_htmlObjId).then(function () {
                                            var idElemHtmlState = "qa-" + l_qlikAppName.replace(/ /g, "") + "_State";
                                            console.log("Cacher idElemHtmlState = " + idElemHtmlState );
                                            document.getElementById(idElemHtmlState).style.display = 'none';
                                        });
                                    });
                                })(app, htmlObjId, qlikServer, qlikAppName, qlikAppId);

                            })(qlik, local_iHost[j]);
                        }
                        //qlik = null;
                    }, config);

                });
            })(_host[i]);
        }

    }
}

//Cause Bug, sur maj des CB, vides la liste des valeurs seléctionnées
function RazSelectedList(objId) {
    document.getElementById(objId).value = '';
}

//Initialise les liens vers les ressources Qlik (css, require.js,...)
function InitQlikRessources(uri, ticket, htmlObjectId) {

    if (htmlObjectId.indexOf("qlikLinkCSS") > -1 ) {

        if (document.getElementById(htmlObjectId) != undefined) {
            var link = document.getElementById(htmlObjectId);
            var href = uri + '/resources/autogenerated/qlik-styles.css' + '?qlikTicket=' + ticket;
            link.setAttribute('href', href);
            console.log("InitQlikRessources - Ticket consommé sur  : " + href);
            //link.href = global_serveur + '/resources/autogenerated/qlik-styles.css';
        }
    }
   /* else if (htmlObjectId == "qlikScriptRequireJS") {
        if (document.getElementById('qlikScriptRequireJS') != undefined) {
            var scriptJS = document.getElementById('qlikScriptRequireJS');
            scriptJS.setAttribute('src', global_serveur + '/resources/assets/external/requirejs/require.js');
            //scriptJS.src = global_serveur + '/resources/assets/external/requirejs/require.js';
        }
    }*/
    return true;
}

//function InitQlikRessources2(serveur, ticket) {

//    var downloadingImage = new Image();
//    url_TicketConsume = serveur + "/resources/img/core/dark_noise_16x16.png" + "?qlikTicket=" + ticket ;
//    downloadingImage.onload = function () {       
//        console.log("Ticket consumé !");
//    };
//    downloadingImage.src = url_TicketConsume;
//}

//Récupère et cconsomme le ticket
function InitQlikTicket(serveur) {
    //var serveurProd = { protocol : "http://", host : "srv02bi", type : serveurTypeProd};
    $(document).ready(function () {
        var uri = '/api/ticket/';
        //$.getJSON(uri + serveur.replace("http://", "") + "/")
        $.getJSON(uri + serveur.host)
            //Get le ticket
            .done(function (data) {
                var ticketAPI = {};
                ticketAPI = data;
                var ticket = ticketAPI.Ticket;
                sessionStorage.setItem("ticket_" + serveur.host, ticket);
                var idHtmlObj = "qlikLinkCSS" + (serveur.isServeurDev ? "_Dev" : "_Prod");

                //Consomme le ticket
                InitQlikRessources(serveur.protocol + serveur.host, ticket, idHtmlObj);
                
            })
            .fail(function (jqXHR, textStatus, err) {
                alert('InitQlikTicket - Erreur sur serveur : ' + serveur + "\n" + err);
                });
    });
}

function loadRequireJS(loadServeur, callback) {
    console.log("début loadRequireJS");
    var config = {
        host: loadServeur,
        port: 80,
        prefix: '/',
        isSecure: false
    };
    require.config({ baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources" });

    require(["js/qlik"], function (qlik) {

        qlik.setOnError(function (error) {
            alert(error.message);
        });

        if(callback) callback(true);
    });
}

function CompleteAllQlikVizu(qlikObjectOTF) {

    //Rempli les objets en chargeant le fichier requiresjs une première fois au préalable
    //Evite erreur lors de la selection d'une seule application étant sur l'autre serveur que le celui de référence pour le requirejs
    loadRequireJS(
        _serveur[1].host.replace("http://", ""),
        function (OTF) {
            //Fonction de CallBack
            FillAllQlikVizu(OTF);
        }(qlikObjectOTF));
}
