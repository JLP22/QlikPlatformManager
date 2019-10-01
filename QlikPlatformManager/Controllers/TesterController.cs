using Newtonsoft.Json;
using Qlik.Engine;
using QlikPlatformManager.Utils;
using QlikPlatformManager.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.Controllers
{
    public class TesterController : Controller
    {
        // GET: Tester
        public ActionResult Donnees()
        {
            TesterDonneesViewModel modelIHM = new TesterDonneesViewModel();
            return View(InitilizeData(modelIHM));
        }

        // POST : Tester
        [HttpPost]
        [ActionName("Donnees")]
        public ActionResult DonneesPost(TesterDonneesViewModel modelIHM)
        {

            //if (modelIHM.SelectedApplications != null) modelIHM.SelectedEnvironnements = modelIHM.SelectedEnvironnements.Where(val => !String.IsNullOrEmpty(val)).ToArray();
            if (modelIHM.SelectedEnvironnements != null) modelIHM.SelectedEnvironnements = modelIHM.SelectedEnvironnements.Distinct().ToArray();

            //if (modelIHM.SelectedApplications != null) modelIHM.SelectedApplications = modelIHM.SelectedApplications.Where(val => !String.IsNullOrEmpty(val)).ToArray();
            if (modelIHM.SelectedApplications != null) modelIHM.SelectedApplications = modelIHM.SelectedApplications.Distinct().ToArray();

            TesterDonneesViewModel param = InitilizeData(modelIHM);
            param.SelectedModele = modelIHM.SelectedModele;
            param.SelectedApplications = modelIHM.SelectedApplications;
            param.SelectedEnvironnements = modelIHM.SelectedEnvironnements;

            return PartialView(param);
        }

        /*****************************************************/
        private SortedDictionary<string, string> GetSortedList(Hashtable hash)
        {
            SortedDictionary<string, string> sortedList = new SortedDictionary<string, string>();
            foreach (DictionaryEntry elem in hash)
                sortedList.Add(elem.Key.ToString(), elem.Value.ToString());
            return sortedList;
        }
        /*****************************************************/
        private TesterDonneesViewModel InitilizeData(TesterDonneesViewModel modelIHM)
        {
            //Récupère information de paramétrage
            SortedDictionary<string, string> _paramEnvironnements = GetSortedList((Hashtable)ConfigurationManager.GetSection("TesterDonnees/EnvironnementsList"));
            SortedDictionary<string, string> _paramModeles = GetSortedList((Hashtable)ConfigurationManager.GetSection("TesterDonnees/ModelesList"));
            SortedDictionary<string, string> _paramModelesApplications = GetSortedList((Hashtable)ConfigurationManager.GetSection("TesterDonnees/ModelesApplicationsList"));

            TesterDonneesViewModel param = new TesterDonneesViewModel();

            //------------- Environnements ---------------------------------
            param._AllEnvironnements = new List<ModeleEnvironnement>();
            foreach (var env in _paramEnvironnements)
            {
                string id = (string)env.Key;
                string name = (string)env.Value.Split(';')[0];
                param._AllEnvironnements.Add(new ModeleEnvironnement { ID = id, Name = name });
            }

            //------------- Modele ---------------------------------
            List<Modele> _modeles = new List<Modele>();
            foreach(var modele in _paramModeles)
            {
                string id = (string)modele.Key;
                string name = (string)modele.Value;
                //string name = (string)modele.Value.ToString().Split(';')[1];
                _modeles.Add(new Modele { ID = id, Name = name });
            }
            param._Modeles = Common.ToSelectListItem(_modeles.ToList());

            //------------- Application (dépend du modèle selectionné-------
            if (!String.IsNullOrEmpty(modelIHM.SelectedModele))
            {
                param._AllApplications = new List<ModeleApplication>();
                foreach (var app in _paramModelesApplications)
                {
                    string id = (string)app.Key;
                    string name = (string)app.Value;
                    if(id.Contains(modelIHM.SelectedModele))
                        param._AllApplications.Add(new ModeleApplication { ID = id, Name = name });
                }
            }

            //------------- Objets à afficher ---------------------------------
            if (    !String.IsNullOrEmpty(modelIHM.SelectedModele) && 
                    (modelIHM.SelectedApplications != null && modelIHM.SelectedApplications.Length> 0 && String.Join("",modelIHM.SelectedApplications).Trim() != "") &&
                    (modelIHM.SelectedEnvironnements!= null && modelIHM.SelectedEnvironnements.Length > 0 && String.Join("", modelIHM.SelectedEnvironnements).Trim() != "") )
            {
                //int nbObjetVizu = modelIHM.SelectedApplications.Length * modelIHM.SelectedEnvironnements.Length;
                List<ModeleVizualisation> _visuOTF = new List<ModeleVizualisation>();

                //Par environnement
                foreach (var env in _paramEnvironnements.Where(env => modelIHM.SelectedEnvironnements.Contains((string)env.Key)))
                //foreach (var env in param._AllEnvironnements.Where(env => modelIHM.SelectedEnvironnements.Contains(env.ID)))
                {
                    //Par application
                    foreach (var app in param._AllApplications.Where(app => modelIHM.SelectedApplications.Contains(app.ID)))
                    {
                        string envi = env.Value.Split(';')[0];
                        string appSuffix = env.Value.Split(';')[1];
                        string host = env.Value.Split(';')[2];
                        string appl = app.Name;
                        //string objet = GetObjetViZu(modelIHM.SelectedModele);

                        string tmp_objOTF ="";
                        string selectedModel = param._Modeles.Where(model => (model.Value == modelIHM.SelectedModele)).First().Text;

                        if (selectedModel == "Vente") tmp_objOTF = JsonConvert.SerializeObject(new Ventes_OTF().Colonnes); 
                        else if (selectedModel == "Stock") tmp_objOTF = JsonConvert.SerializeObject(new Stock_OTF().Colonnes); 
                        else if (selectedModel == "Téléphonie") tmp_objOTF = JsonConvert.SerializeObject(new Telephonie_OTF().Colonnes); 
                                                
                        ModeleVizualisation objOTF = new ModeleVizualisation
                        {
                            ApplicationName = app.Name + " " + appSuffix,
                            Host = host,
                            Objet = tmp_objOTF
                        };
                        _visuOTF.Add(objOTF);
                    }
                }
                param._VizuOTF = _visuOTF.ToArray();
                

                /*param._VizuOTF = new ModeleVizualisation[]{
                    new ModeleVizualisation { ApplicationID ="f68ea504-73c1-4de1-ab39-e10f35be4d81", ApplicationName = "Ventes client (dev)", Host = "bi.cerpba.int", Objet = JsonConvert.SerializeObject(new ObjetOTF().Colonnes) },
                    new ModeleVizualisation { ApplicationID ="60ad13ec-4b48-4a83-9a1e-73cdd74f4ba4", ApplicationName = "Ventes client-article (dev)", Host = "bi.cerpba.int", Objet = JsonConvert.SerializeObject(new ObjetOTF().Colonnes) }
                };*/

            }

            return param;
        }


        /*
        //-----------------------------------------------------------
        // Création de l'objet au format JSON de type TABLE à afficher
        //-----------------------------------------------------------
        private string GetObjetViZu(string modelSelected)
        {
            Object[] colonnes;
            if (modelSelected == "Vente")
            {
                colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Societe.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%SOURCE"}, FieldLabels=new List<string>() { "Source"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Ventes.CaBrut)", Label ="CaBrut" }, AttributeDimensions=null, AttributeExpressions=null }
                };
            }

            else if(modelSelected == "Stock")
            {
                colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Societe.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%SOURCE"}, FieldLabels=new List<string>() { "Source"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Ventes.CaBrut)", Label ="CaBrut" }, AttributeDimensions=null, AttributeExpressions=null }
                };
            }

            else if(modelSelected == "Téléphonie")
            {
                colonnes = new Object[]{
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%CODESI"}, FieldLabels=new List<string>() { "%CODESI"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=Societe.Code"}, FieldLabels=new List<string>() { "Societe"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxDimension { Def = new NxInlineDimensionDef{ FieldDefs=new List<string>() { "=%SOURCE"}, FieldLabels=new List<string>() { "Source"} }, AttributeDimensions=null, AttributeExpressions = null },
                new NxMeasure { Def = new NxInlineMeasureDef{ Def ="Sum(Ventes.CaBrut)", Label ="CaBrut" }, AttributeDimensions=null, AttributeExpressions=null }
                };
            }

            else {
                colonnes = new Object[] { };
            }

            return JsonConvert.SerializeObject(colonnes);
        }*/
    }
}