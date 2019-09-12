﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverStructureConnexionViewModel
    {
        //Constructeur
        public ArchiverStructureConnexionViewModel()
        {
            Connexion = new ServeurViewModel();
        }

        //Propriétés

        /* Serveur de connexion */
        public ServeurViewModel Connexion { get; set; }

        /*Export Json demandé */
        public bool ExportJson { get; set; }
        /*Export Xls demandé */
        public bool ExportXls { get; set; }

        /* Resultat */
        public ResultsViewModel Results = new ResultsViewModel();

        

        //Méthodes

        //------------------------------------------------------------------
        // Préfixe les champs de vue partielle par le nom de l'objet parent
        //Nécessaire pour les sous-objet
        //------------------------------------------------------------------
        public ViewDataDictionary GetViewData(HtmlHelper<ArchiverStructureConnexionViewModel> html)
        {
            string name = html.NameFor(m => m.Connexion).ToString();

            //string prefix = html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            string prefix = name;
            ViewDataDictionary viewData = new ViewDataDictionary(html.ViewData)
            {
                TemplateInfo = new TemplateInfo { HtmlFieldPrefix = prefix }
            };
            return viewData;
        }
    }
}