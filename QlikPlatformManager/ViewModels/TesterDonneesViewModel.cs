using Qlik.Engine;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.ViewModels
{

    public class Modele
    {
        public string ID { get; set; }
        public string Name { get; set; }
    }

    public class ModeleEnvironnement
    {
        //public int ID { get; set; }
        public string ID { get; set; }
        public string Name { get; set; }
    }

   public class ModeleApplication
    {
        //public int ID { get; set; }
        public string Name { get; set; }
        public string ID { get; set; }
    }

    public class ModeleVizualisation
    {
        public string Host { get; set; } //ex 'bi.cerpba.int'
        public string ApplicationID { get; set; }
        public string ApplicationName { get; set; }
        public string Objet { get; set; }
    }
    
    public class TesterDonneesViewModel
    {

        //Propriétés
        //-- Modeles
        //Liste des modeles
        public List<SelectListItem> _Modeles { get; set; }
        //Modele sélectionné
        [Display(Name = "Modèle")]
        [Required(ErrorMessage = "Le modèle doit être sélectionné")]
        public string SelectedModele { get; set; }

        //-- Applications
        //Liste des applications
        public List<ModeleApplication> _AllApplications { get; set; }
        public List<ModeleApplication> _TesterApplications { get; set; }
        //Application sélectionnée
        [Display(Name = "Applications")]
        [Required(ErrorMessage = "Au moins une application doit être sélectionnée")]
        public string[] SelectedApplications { get; set; }

        //-- Environnements
        //Liste des applications
        public List<ModeleEnvironnement> _AllEnvironnements { get; set; }
        public List<ModeleEnvironnement> _TesterEnvironnements { get; set; }
        //Application sélectionnée
        [Display(Name = "Environnements")]
        [Required(ErrorMessage = "Au moins un environnement doit être sélectionnée")]
        public string[] SelectedEnvironnements { get; set; }

        //-- Objet à visualizer
        //Paramétrage des visualisations
        public ModeleVizualisation[] _VizuOTF { get; set; }

        //-- Résultats
        public ResultsViewModel Results = new ResultsViewModel();

        //Constructeur
        public TesterDonneesViewModel()
        {
        }
    }

    public class ObjetOTF
    {
        public string Type { get; set; } //ex 'bi.cerpba.int'
        public Object[] Colonnes { get; set; }
        public Object Options { get; set; }
        //Constructeur
        public ObjetOTF()
        {
            Type = "table";
            Options = new Options { title = "My title"};
            Colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Societe.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%SOURCE"}, FieldLabels=new List<string>() { "Source"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Ventes.CaBrut)", Label ="CaBrut" }, AttributeDimensions=null, AttributeExpressions=null }
            };
        }    
    }

    public class Options
    {
        public string title { get; set; }
        public string subtitle { get; set; }
        public string footnote { get; set; }
    }
}