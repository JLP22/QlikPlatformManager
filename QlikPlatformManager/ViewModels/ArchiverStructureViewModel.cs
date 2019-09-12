using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;
using static QlikUtils.Utilitaires;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverStructureViewModel
    {
        //Constructeur
        public ArchiverStructureViewModel()
        {
            ServeurRef = new ArchiverStructureConnexionViewModel();
            ServeurComp = new ArchiverStructureConnexionViewModel();
        }

        //Propriétés

        /* Serveur de référence */
        public ArchiverStructureConnexionViewModel ServeurRef { get; set; }

        /* Serveur de comparaison*/
        public ArchiverStructureConnexionViewModel ServeurComp { get; set; } 

        /* Resultat */
        public ResultsViewModel Results = new ResultsViewModel();

        //Méthodes
        
        //------------------------------------------------------------------
        // Préfixe les champs de vue partielle par le nom de l'objet parent
        //Nécessaire pour les sous-objet
        //------------------------------------------------------------------
        public ViewDataDictionary GetViewData(HtmlHelper<ArchiverStructureViewModel> html, string serveur)
        {
            string name = "";
            if (serveur == "ServeurComp") name = html.NameFor(m => m.ServeurComp).ToString();
            else name = html.NameFor(m => m.ServeurRef).ToString();

            string prefix = html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            ViewDataDictionary viewData = new ViewDataDictionary(html.ViewData)
            {
                TemplateInfo = new TemplateInfo { HtmlFieldPrefix = prefix }
            };
            return viewData;
        }

        //------------------------------------------------------------------
        // Compare la structure des 2 applications
        //------------------------------------------------------------------
        public void Comparer()
        {
            //Répertoire d'export
            //string exportDir = ConfigurationManager.AppSettings["ExportDirectory"];
            //Fichier à créer directement sur le poste local (rassemble l'étape de création puis de copie)
            string exportDir = "\\\\" + Common.GetHostName() + "\\" + ConfigurationManager.AppSettings["ImportDirectory"] + "\\";
            string suffixeExportDir = ConfigurationManager.AppSettings["ExportSuffix"];
            string fileDir = exportDir + DateTime.Now.ToString("yyyyMMdd") + suffixeExportDir.Replace(" ", "%20") + @"\";

            var serveurRefName = ServeurRef.Connexion._Application.Where(a => a.Value == ServeurRef.Connexion.Application).First().Text;
            var serveurCompName = ServeurComp.Connexion._Application.Where(a => a.Value == ServeurComp.Connexion.Application).First().Text;

            Results.addDetails("Début de la comparaison");

            //List<string> _fullFileName = QEngineConnexion.ExportModeleApplication(Application, fileDir);
            //Export du modele
                        
            Results.addDetails("Début de l'export du modèle de l'application " + serveurRefName);
            ExportModeleApp csvModelAppRef = ServeurRef.Connexion.QEngineConnexion.ExportModeleApplication(ServeurRef.Connexion.Application);
            List<string> _csvModelAppRef = ServeurRef.Connexion.QEngineConnexion.ModeleToTableau(csvModelAppRef);

            Results.addDetails("Début de l'export du modèle de l'application " + serveurCompName);
            ExportModeleApp csvModelAppComp = ServeurComp.Connexion.QEngineConnexion.ExportModeleApplication(ServeurComp.Connexion.Application);
            List<string> _csvModelAppComp = ServeurComp.Connexion.QEngineConnexion.ModeleToTableau(csvModelAppComp);

            //Liste des objet en différences
            Dictionary<string, string> _diffRef = CompareModelApplication(csvModelAppRef, csvModelAppComp);
            Dictionary<string, string> _diffComp = CompareModelApplication(csvModelAppComp, csvModelAppRef);

            List<string> _diff = new List<string>();
            //Ecriture de l'entete
            _diff.Add(_csvModelAppComp.First());

            Results.addDetails("Début de la comparaison à partir de l'application de référence " + serveurRefName);
            //Comparaison à partir du serveur de ref
            foreach (var line in _csvModelAppRef)
            {
                foreach (var id in _diffRef)
                    if(line.Contains("\"" + id.Key + "\"") && line.Contains("\"" + id.Value + "\"")) _diff.Add(line);
            }
            
            Results.addDetails("Début de la comparaison à partir de l'application de comparaison " + serveurCompName);
            //Comparaison à partir du serveur de ref
            foreach (var line in _csvModelAppComp)
            {
                foreach (var id in _diffComp)
                    if (line.Contains("\"" + id.Key + "\"") && line.Contains("\"" + id.Value + "\"")) _diff.Add(line);
            }

            //Ecriture du tableau de différence
            ExistOrCreate(fileDir);
            //Ecriture du fichier
            string baseFileName = fileDir + ServeurRef.Connexion.Application + "-" + DateTime.Now.ToString("yyyyMMddHHmmss");
            baseFileName = fileDir + "Comp_" + serveurRefName + "-" + DateTime.Now.ToString("yyyyMMddHHmmss");
            string suffixeFicher = ".csv";
            string fullFileName = baseFileName + suffixeFicher;

            
            Results.addDetails("Début de la génération du fichier de détails");
            //Results.addDetails("<Table><TR><TD>objet</TD><TD>Cause</TD></TR><TR><TD>123456</TD><TD>doublon</TD></TR></Table>");
            Results.addDetails("Début de la génération du tableau de synthèse" + "<BR/>" + AddDetailsSynthesCompare(_diffRef, _diffComp));

            WriteTabToFile(_diff, fullFileName);

            if (string.IsNullOrEmpty(fullFileName)) Results.addDetails("Export du modèle en erreur");
            else
            {
                Results.addDetails("Fichier à analyser : " + fullFileName.Replace(" ", "%20"));
                //Results.addDetails("<a href =\"/Archiver/DownloadFile?fullFileName=" + fullFileName.Replace(" ", "%20") + "\">>Télécharger</a>&nbsp&nbsp&nbsp&nbsp<a href=\"file:///" + fileDir + "\">>Ouvrir le répertoire</a>");
                Results.addDetails("<a href =\"file:///" + fileDir + "\">>Ouvrir le répertoire</a>");
                Results.Title = "Comparaison OK";
            }
        }
        //------------------------------------------------------------------
        // Compare la structure des 2 applications
        //------------------------------------------------------------------
        private string AddDetailsSynthesCompare(Dictionary<string, string> _diffRef, Dictionary<string, string> _diffComp)
        {

            //Répartition des objets en anomalie

            List<string> _missingRef = new List<string>();
            List<string> _missingComp = new List<string>();
            List< string > _different = new List<string>();                           
            
            foreach (var refObject in _diffRef)
            {
                //Alimentation tableau des objets présents dans les 2 list de comparaison (et donc objet différent)
                if (_diffComp.ContainsKey(refObject.Key)) _different.Add(refObject.Key);
                //si objet absent de _diffComp, alors objet absent de l'application de comparaison
                else _missingComp.Add(refObject.Key);
            }
            //Les objets n'ayant pas encore été traités sont forcément absent de l'application de référence
            foreach (var compObject in _diffComp)
            {
                if (!_different.Contains(compObject.Key) && !_missingComp.Contains(compObject.Key) ) _missingRef.Add(compObject.Key);
            }

            //Création des tableaux html à afficher dans le détails
            string tableaux = "";
            tableaux += AddDetailsSynthesCompareCreateHTMLTable(_different, "Objets différents", "table-danger");
            tableaux += AddDetailsSynthesCompareCreateHTMLTable(_missingRef, "Objets absents de l'application de référence", "table-warning");
            tableaux += AddDetailsSynthesCompareCreateHTMLTable(_missingComp, "Objets absents de l'application de comparaison", "table-info");
            
            return tableaux;
        }

        //------------------------------------------------------------------
        // Compare la structure des 2 applications
        //------------------------------------------------------------------
        private string AddDetailsSynthesCompareCreateHTMLTable(List<string> _item, string MotifAnomalie, string trClass)
        {
            string tableau = "";
            int i = 0;

            //entete
            tableau += "<table class=\"table table-hover table-bordered table-sm\" ><thead class=\"thead-dark\" ><tr><th scope=\"col\" >#</th><th scope=\"col\">" + MotifAnomalie +"(" + _item.Count() + ")</th></tr></thead><tbody>";
            //Corps
            foreach (var item in _item) { i++; tableau += "<tr class=\""+ trClass +"\"><th scope=\"row\">" + i + "</th><td>" + item + "</td></tr>"; }
            //Fin
            tableau += "</tbody></table>";

            return tableau;
        }
    }
}