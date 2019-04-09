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
    $("#form0 :input").attr("disabled", true);
}
/**
 * Gestion du style du bouton de soumission du formulaire AJAX (après soumission)
 * @method
 * @memberof Mine.Utils
 */
function onComplete() {
    $("#ActionStateSpr")[0].style.display = 'none';
    $("#ActionStateBtn").attr("disabled", false);
    if ($("#ResultsTitle").text().includes("OK")) {
        $("#Results").attr("class", "alert alert-success");
    }

    //Affichage coche de validation pour serveur et flux car soumis
    if ($("#serveurSource option:selected").text() != "") $("#ConnexionFromServerSpan")[0].style.display = '';
    if ($("#fluxSource option:selected").text() != "") $("#ConnexionFromFluxSpan")[0].style.display = '';
    //Affichage coche de validation pour application si Archivage OK
    if ($("#applicationSource option:selected").text() != "" && $("#ResultsTitle").text().includes("OK")) {
        SetApplicationTitle("#applicationSource", "#ConnexionFromApplicationSpan");
        $("#ConnexionFromApplicationSpan")[0].style.display = '';
    }
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

    var senderId = "#" + sender.id;
    //Valeur sélectionnée
    if ($(senderId).text() != "") {
        //Sélection d'un serveur
        if (senderId== "#serveurSource") {
            //Cacher coche de validation pour serveur si pas sélectionné
            //if ($("#serveurSource option:selected").text() == "") $("#ConnexionFromServerSpan")[0].style.display = 'none';
            $("#ConnexionFromServerSpan")[0].style.display = 'none';

            //RAZ des autres select
            $('#fluxSource option:eq(0)').prop('selected', true);
            $("#ConnexionFromFluxSpan")[0].style.display = 'none';
            $('#applicationSource option:eq(0)').prop('selected', true);
            $("#ConnexionFromApplicationSpan")[0].style.display = 'none';

            //Suppression de la validation cliente du champ
            $("#fluxSource").rules('remove', 'required');
            $("#applicationSource").rules('remove', 'required');

            //Envoi du formulaire
            //var f = $(sender).closest('form');
            //f.submit();
            $(senderId).closest('form').submit();

            //reactivation de la validation
            //alertIfRequired("#fluxSource");
            $("#fluxSource").rules("add", "required");
            //alertIfRequired("#fluxSource");
            $("#applicationSource").rules("add", "required");
        }
        //Sélection d'un flux
        else if (senderId == "#fluxSource") {
            //RAZ select application
            $('#applicationSource option:eq(0)').prop('selected', true);
            $("#ConnexionFromApplicationSpan")[0].style.display = 'none';
            //Suppression de la validation cliente du champ
            $("#applicationSource").rules('remove', 'required');
            //Envoi du formulaire
            $(senderId).closest('form').submit();
            //reactivation de la validation
            $("#applicationSource").rules("add", "required");

            //Cacher coche de validation pour serveur si pas sélectionné
            //if ($("#fluxSource option:selected").text() == "") $("#ConnexionFromFluxSpan")[0].style.display = 'none';
            $("#ConnexionFromFluxSpan")[0].style.display = 'none';
        }
        //Sélection d'une application
        else if (senderId == "#applicationSource") {

            //Affichage coche de validation pour application si selectionnée
            if ($("#applicationSource option:selected").text() != "")
            {
                //Alimentation de la balise title
                SetApplicationTitle("#applicationSource", "#ConnexionFromApplicationSpan");
                //Affichage de la coche
                $("#ConnexionFromApplicationSpan")[0].style.display = '';
            }
            else $("#ConnexionFromApplicationSpan")[0].style.display = 'none';
            //$('#fluxSource option:eq(0)').prop('selected', true);            
        }
    }
}

/**
 * Alimente l'infobulle avec les information de l'application sélectionnée
 * @method
 * @memberof Mine.Utils
 * @argument {Eement} element
 */
function SetApplicationTitle(idElementApplicationSource, idElementApplicationSpan) {
    var newTitle = GetinfosApplicationTitle(idElementApplicationSource);
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