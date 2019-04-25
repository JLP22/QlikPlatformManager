/**
 * Gestion des infobulles
 * @method
 * @memberof Mine.Utils
 */
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
/**
 * Gestion du style du bouton de soumission du formulaire AJAX (avant soumission)
 * @method
 * @memberof Mine.Utils
 */
function onBegin() {
    $("#ActionStateSpr")[0].style.display = '';
    $("#ActionStateBtn").attr("disabled", true);
    $("#" + this.id + " :input").attr("disabled", true);
}
/**
 * Gestion du style du bouton de soumission du formulaire AJAX (après soumission)
 * @method
 * @memberof Mine.Utils
 */
function onComplete() {
    debugger;
    $("#ActionStateSpr")[0].style.display = 'none';
    $("#ActionStateBtn").attr("disabled", false);
    if ($("#ResultsTitle").text().includes("OK")) {
        $("#Results").attr("class", "alert alert-success");
    }
  
    //Affichage des infobulles si nécessaire (champs select et spans associés)
    SetSpanTitle();
    
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
        if (idSelect.indexOf("Serveur_Select") || idSelect.indexOf("Flux_Select")) {
            //Si renseigné, Affichage coche
            if ($("#" + idSelect + " option:selected").text() != "") $("#" + idSpan)[0].style.display = '';
            //alert("Affichage span " + idSpan);

        }
        //Cas Select d'application
        else if (idSelect.indexOf("Application_Select")) {
            //Si renseigné et résultat du post du formulaire OK
            if ($("#" + idSelect + " option:selected").text() != "" && $("#ResultsTitle").text().includes("OK")) {
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
 * Gestion du style du bouton de soumission du formulaire AJAX (après soumission et erreur)
 * @method
  * @memberof Mine.Utils
 */
function Erreur() {
    //$("#ArchivageApplicationDiv").html("Une erreur s'est produite lors de la recherche, veuillez réessayer ...");
    $("#ActionStateSpr")[0].style.display = 'none';
    $("#ActionStateBtn").attr("disabled", false);
}

/**
 * Evènement déclenché sur la modification de valeur d'un champ liste
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function OnChangeSelect(sender) {
    debugger;
    var suffixSelect = "_Select";
    var suffixSpan = "_Span";

    var prefix = sender.id.substr(0, sender.id.replace(suffixSelect, "").lastIndexOf("_")+1);
    var idServeur_Select = prefix + "Serveur" + suffixSelect;
    var idServeur_Span = prefix + "Serveur" + suffixSpan;
    var idFlux_Select = prefix + "Flux" + suffixSelect;
    var idFlux_Span = prefix + "Flux" + suffixSpan;
    var idApplication_Select = prefix + "Application" + suffixSelect;
    var idApplication_Span = prefix + "Application" + suffixSpan;

    var senderId = "#" + sender.id;
    //Valeur sélectionnée
    //if ($(senderId).val() != "")
    if ($("#" + sender.id + " option:selected").text() != "")
    {
        //Sélection d'un serveur
        if (sender.id == idServeur_Select) {
            //Cacher coche de validation pour serveur si pas sélectionné
            //if ($("#serveur option:selected").text() == "") $("#ConnexionFromServerSpan")[0].style.display = 'none';

            $("#"+idServeur_Span)[0].style.display = 'none';

            //RAZ des autres select
            $("#" + idFlux_Select + " option:eq(0)").prop('selected', true);
            $("#" + idFlux_Span)[0].style.display = 'none';
            $("#" + idApplication_Select + " option:eq(0)").prop('selected', true);
            $("#" + idApplication_Span)[0].style.display = 'none';

            //Suppression de la validation cliente du champ
            $("#"+idFlux_Select).rules('remove', 'required');
            $("#"+idApplication_Select).rules('remove', 'required');

            //Envoi du formulaire
            //var f = $(sender).closest('form');
            //f.submit();
            $("#"+sender.id).closest('form').submit();

            //reactivation de la validation
            //alertIfRequired("#flux");
            $("#" + idFlux_Select).rules("add", "required");
            //alertIfRequired("#flux");
            $("#" + idApplication_Select).rules("add", "required");
        }
        //Sélection d'un flux
        else if (sender.id == idFlux_Select) {
            //RAZ select application
            $("#" + idApplication_Select + " option:eq(0)").prop('selected', true);
            $("#" + idApplication_Span)[0].style.display = 'none';
            //Suppression de la validation cliente du champ
            $("#" + idApplication_Select).rules('remove', 'required');
            //Envoi du formulaire
            $(senderId).closest('form').submit();
            //reactivation de la validation
            $("#" + idApplication_Select).rules("add", "required");

            //Cacher coche de validation pour serveur si pas sélectionné
            //if ($("#flux option:selected").text() == "") $("#ConnexionFromFluxSpan")[0].style.display = 'none';
            $("#" + idApplication_Span)[0].style.display = 'none';
        }
        //Sélection d'une application
        else if (sender.id == idApplication_Select) {

            //Affichage coche de validation pour application si selectionnée
            if ($("#"+idApplication_Select+" option:selected").text() != "")
            {
                //Alimentation de la balise title
                SetApplicationTitle("#" + idApplication_Select, "#" + idApplication_Span);
                //Affichage de la coche
                $("#" + idApplication_Span)[0].style.display = '';
            }
            else $("#" + idApplication_Span)[0].style.display = 'none';         
        }
    }
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
    $(idElementApplicationSpan).attr("data-original-title", newTitle);
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
    for (app in _infosApplication) {
        //alert($(idElementApplication + " option:selected").text() + " >>>> " + app);
        if (app == $(idElementApplication + " option:selected").text()) {
            infosApplicationTitle = _infosApplication[app];
            break;
        }
    }
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
    debugger;
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