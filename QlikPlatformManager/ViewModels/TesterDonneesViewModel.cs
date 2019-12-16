using Newtonsoft.Json;
using Qlik.Engine;
using QlikPlatformManager.Utils;
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
        public string Ticket { get; set; } //ex 'bi.cerpba.int'
        public string ApplicationName { get; set; }
        public string Objet { get; set; }
    }
    
    public class TesterDonneesViewModel
    {

        //Propriétés
        
        //-- Environnements
        //Liste des environnements
        public List<ModeleEnvironnement> _AllEnvironnements { get; set; }
        public List<ModeleEnvironnement> _TesterEnvironnements { get; set; }
        //Environnements sélectionnée
        [Display(Name = "Environnements")]
        [Required(ErrorMessage = "Au moins un environnement doit être sélectionnée")]
        public string[] SelectedEnvironnements { get; set; }

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
        //Applications sélectionnées
        [Display(Name = "Applications")]
        [Required(ErrorMessage = "Au moins une application doit être sélectionnée")]
        public string[] SelectedApplications { get; set; }


        //-- Objet à visualizer
        //Paramétrage des visualisations
        public ModeleVizualisation[] _VizuOTF { get; set; }

        //-- Résultats
        public ResultsViewModel Results = new ResultsViewModel();

        // Accès aux éléments de configuration de l'applicaiton 
        private QPMConfiguration qpmConfig;

        //Constructeur
        public TesterDonneesViewModel()
        {
            //L'objet à besoin de connaitre la config à plusieurs endroits pour ses traitements
            qpmConfig = Common.QPMGetConfig();
            Init();
        }
        //---------------------------------------------------------------------------
        // Initialisation des liste Environnement et modèle
        //---------------------------------------------------------------------------
        private void Init()
        {

            //------------- Environnements ---------------------------------
            _AllEnvironnements = new List<ModeleEnvironnement>();
            foreach (var env in qpmConfig.TesterDonnees.EnvironnementsList)
            {
                string id = (string)env.Key;
                string name = (string)env.Value.Split(';')[0];
                _AllEnvironnements.Add(new ModeleEnvironnement { ID = id, Name = name });
            }

            //------------- Modele ---------------------------------
            _Modeles = new List<SelectListItem>();
            List<Modele> _tmpModeles = new List<Modele>();
            foreach (var modele in qpmConfig.TesterDonnees.ModelesList)
            {
                string id = (string)modele.Key;
                string name = (string)modele.Value;
                //string name = (string)modele.Value.ToString().Split(';')[1];
                _tmpModeles.Add(new Modele { ID = id, Name = name });
            }
            _Modeles = Common.ToSelectListItem(_tmpModeles.ToList());
        }

        //---------------------------------------------------------------------------
        // Initialisation de la liste Application en fonction du modèle sélectionné
        //---------------------------------------------------------------------------
        public void PopulateApplication(string selectedModel)
        {
            _AllApplications = new List<ModeleApplication>();
            foreach (var app in qpmConfig.TesterDonnees.ModelesApplicationsList)
            {
                string id = (string)app.Key;
                string name = (string)app.Value;
                if (id.Contains(selectedModel)) _AllApplications.Add(new ModeleApplication { ID = id, Name = name });
            }          
        }

        //---------------------------------------------------------------------------
        // Initialisation de la liste Application en fonction du modèle sélectionné
        //---------------------------------------------------------------------------
        public void PopulateObjectOTF(string[] selectedEnvironnements, string selectedModel, string[] selectedApplications)
        {

            List<ModeleVizualisation>  _tmpVizuOTF = new List<ModeleVizualisation>();
            //Par environnement
            foreach (var env in qpmConfig.TesterDonnees.EnvironnementsList.Where(env => selectedEnvironnements.Contains((string)env.Key)))
            {
                string envi = env.Value.Split(';')[0];
                string appSuffix = env.Value.Split(';')[1];
                string host = env.Value.Split(';')[2];
                //JLEP Supprimer ticket ?
                //string ticket = GetTicket(host);


                //Par application
                foreach (var app in _AllApplications.Where(app => selectedApplications.Contains(app.ID)))
                {
                    string appl = app.Name;
                    
                    string tmp_objOTF = "";
                    string tmpSelectedModel = _Modeles.Where(model => (model.Value == selectedModel)).First().Text;

                    if (tmpSelectedModel == "Vente") tmp_objOTF = JsonConvert.SerializeObject(new Ventes_OTF().Colonnes);
                    else if (tmpSelectedModel == "Stock") tmp_objOTF = JsonConvert.SerializeObject(new Stock_OTF().Colonnes);
                    else if (tmpSelectedModel == "Téléphonie") tmp_objOTF = JsonConvert.SerializeObject(new Telephonie_OTF().Colonnes);

                    ModeleVizualisation objOTF = new ModeleVizualisation
                    {
                        ApplicationName = app.Name + " " + appSuffix,
                        Host = host,
                        Objet = tmp_objOTF,
                        //JLEPTicket = ticket
                    };
                    _tmpVizuOTF.Add(objOTF);
                }
            }
            _VizuOTF = _tmpVizuOTF.ToArray();

        }
    }
    
    public class Ventes_OTF
    {
        public string Type { get; set; } //ex 'bi.cerpba.int'
        public Object[] Colonnes { get; set; }
        public Object Options { get; set; }
        //Constructeur
        public Ventes_OTF()
        {
            FieldAttributes fmtMonetaire = new FmtMonetaire().NumFormat;
            FieldAttributes fmtQuantite = new FmtQuantite().NumFormat;
            Type = "table";
            Options = new Options { title = "Modèle Ventes"};
            Colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%SOURCE"}, FieldLabels=new List<string>() { "Source"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Annee"}, FieldLabels=new List<string>() { "Annee" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Mois"}, FieldLabels=new List<string>() { "Mois" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Societe.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Count(%CODESI)", Label ="Nb lignes", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null },
                //Ventes facturées
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Ventes.QuantiteFacturee)", Label ="Qt_Facturée", NumFormat = fmtQuantite  }, AttributeDimensions=null, AttributeExpressions=null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Ventes.CaBrut)", Label ="CaBrut", NumFormat = fmtMonetaire }, AttributeDimensions=null, AttributeExpressions=null },
                //Ventes manque
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(VentesManquees.Quantite)", Label ="Qt_Manquées", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null },
                //Pharamml
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(DemandesPharmaML.NonSatisfaite)", Label ="Qt_DIPNs", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null }
            };
        }    
    }

    public class Stock_OTF
    {
        public string Type { get; set; } //ex 'bi.cerpba.int'
        public Object[] Colonnes { get; set; }
        public Object Options { get; set; }
        //Constructeur
        public Stock_OTF()
        {
            FieldAttributes fmtMonetaire = new FmtMonetaire().NumFormat;
            FieldAttributes fmtQuantite = new FmtQuantite().NumFormat;
            Type = "table";
            Options = new Options { title = "Modèle Stock" };
            Colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%SOURCE"}, FieldLabels=new List<string>() { "Source"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Annee"}, FieldLabels=new List<string>() { "Annee" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Mois"}, FieldLabels=new List<string>() { "Mois" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Societe.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=SocieteEtablissement.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Count(%CODESI)", Label ="Nb lignes", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null },
                //Entree-Sortie
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Stock.CodeMouvement"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Stock.QuantiteMouvement)", Label ="Qt_Mvt", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null },
                // Etat
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Stock.Quantite)", Label ="Qt_Stock", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Stock.MontantValorisation)", Label ="Mt_Valorisation", NumFormat = fmtMonetaire }, AttributeDimensions=null, AttributeExpressions=null },
                //Calcul des besoins
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Stock.QuantiteBesoinsSemainePlus1)", Label ="Qt_BesoinsSP1", NumFormat = fmtQuantite}, AttributeDimensions=null, AttributeExpressions=null }
            };
        }
    }

    public class Telephonie_OTF
    {
        public string Type { get; set; } //ex 'bi.cerpba.int'
        public Object[] Colonnes { get; set; }
        public Object Options { get; set; }
        //Constructeur
        public Telephonie_OTF()
        {
            FieldAttributes fmtMonetaire = new FmtMonetaire().NumFormat;
            FieldAttributes fmtQuantite = new FmtQuantite().NumFormat;
            Type = "table";
            Options = new Options { title = "Modèle Telephonie" };
            Colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Annee"}, FieldLabels=new List<string>() { "Annee" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Mois"}, FieldLabels=new List<string>() { "Mois" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Semaine"}, FieldLabels=new List<string>() { "Semaine" } }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="date(Min(%DATE))", Label ="Du" }, AttributeDimensions=null, AttributeExpressions=null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="date(Max(%DATE))", Label ="Au" }, AttributeDimensions=null, AttributeExpressions=null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=POLE"}, FieldLabels=new List<string>() { "Pôle"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="count(%SICLI)", Label ="Nb lignes", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null },                
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(appel_traité)", Label ="Nb appels traités", NumFormat = fmtQuantite }, AttributeDimensions=null, AttributeExpressions=null }
            };
        }
    }

    public class FmtMonetaire
    {
        public FieldAttributes NumFormat { get; set; }
        public FmtMonetaire()
        {
            NumFormat = new FieldAttributes();
            NumFormat.Type = FieldAttrType.MONEY;
            NumFormat.nDec = 2;
            NumFormat.UseThou = 0;
            NumFormat.Fmt = "# ##0,00 €;-# ##0,00 €";
            NumFormat.Dec = ",";
            NumFormat.Thou = " ";
        }
    }

    public class FmtQuantite
    {
        public FieldAttributes NumFormat { get; set; }
        public FmtQuantite()
        {
            NumFormat = new FieldAttributes();
            NumFormat.Type = FieldAttrType.FIX;
            NumFormat.nDec = 2;
            NumFormat.UseThou = 0;
            NumFormat.Fmt = "# ##0";
            NumFormat.Dec = ",";
            NumFormat.Thou = " ";
        }
    }
    /*
    //Monétaire
    "qNumFormat": {
            "qType": "M",
            "qnDec": 2,
            "qUseThou": 0,
            "qFmt": "# ##0,00 €;-# ##0,00 €",
            "qDec": ",",
            "qThou": " "
          }
    //Nombre entier
    "qNumFormat": {
            "qType": "M",
            "qnDec": 2,
            "qUseThou": 0,
            "qFmt": "# ##0,00 €;-# ##0,00 €",
            "qDec": ",",
            "qThou": " "
        }
         */

    public class Options
    {
        public string title { get; set; }
        public string subtitle { get; set; }
        public string footnote { get; set; }
    }
}