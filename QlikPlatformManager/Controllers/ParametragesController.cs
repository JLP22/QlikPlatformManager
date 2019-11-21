using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Models;
using QlikPlatformManager.ViewModels;
using System.Configuration;
using System.Collections;
using QlikPlatformManager.Utils;

namespace QlikPlatformManager.Controllers
{
    [RoutePrefix("Parametrages")]
    public class ParametragesController : Controller
    {
        private QPMContext db = new QPMContext();

        // GET: Parametrages
        [Route("Liste")]
        public async Task<ActionResult> Liste()
        {
            List<Parametrage> _bddParam = await db.Parametrages.ToListAsync();
            List<ParametrageViewModel> _param = new List<ParametrageViewModel>();

            foreach(var p in _bddParam)
            {
                ParametrageViewModel param = new ParametrageViewModel(p);
                _param.Add(param);
            }

            return View(_param);
        }

        // GET: Parametrages/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Parametrage bddParam = await db.Parametrages.FindAsync(id);
            if (bddParam == null)
            {
                return HttpNotFound();
            }
            ParametrageViewModel detailsParam = new ParametrageViewModel(bddParam);
            return View(detailsParam);
        }

        [Route("Create")]
        // GET: Parametrages/Create
        public ActionResult Create()
        {
            return View(new ParametrageViewModel());
        }

        // POST: Parametrages/Create
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("Create")]
        public async Task<ActionResult> Create([Bind(Include = "ID,Cle,Valeur,Type,Details")] ParametrageViewModel paramToCreate)
        {
            if (ModelState.IsValid)
            {
                Parametrage bddParamToCreate = new Parametrage { ID = paramToCreate.ID, Cle = paramToCreate.Cle, Valeur = paramToCreate.Valeur, Type = paramToCreate.Type, Details = paramToCreate.Details };
                db.Parametrages.Add(bddParamToCreate);
                await db.SaveChangesAsync();
                return RedirectToAction("Liste");
            }

            return View(new ParametrageViewModel());
        }
        [Route("Edit")]
        // GET: Parametrages/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            
            Parametrage bddParam = await db.Parametrages.FindAsync(id);
            if (bddParam== null)
            {
                return HttpNotFound();
            }
            ParametrageViewModel paramToEdit = new ParametrageViewModel(bddParam);
            return View(paramToEdit);
        }

        // POST: Parametrages/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("Edit")]
        public async Task<ActionResult> Edit([Bind(Include = "ID,Cle,Valeur,Type,Details")] Parametrage parametrage)
        {
            if (ModelState.IsValid)
            {
                db.Entry(parametrage).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Liste");
            }
            return View(parametrage);
        }

        [Route("Delete")]
        // GET: Parametrages/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Parametrage bddParam = await db.Parametrages.FindAsync(id);
            if (bddParam == null)
            {
                return HttpNotFound();
            }
            ParametrageViewModel paramToDelete = new ParametrageViewModel(bddParam);
            return View(paramToDelete);
        }

        [Route("Delete")]
        // POST: Parametrages/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Parametrage bddParam = await db.Parametrages.FindAsync(id);
            db.Parametrages.Remove(bddParam);
            await db.SaveChangesAsync();
            return RedirectToAction("Liste");
        }

        //-----------------------------------------------------
        // Réinitialisation des paramètres
        //-----------------------------------------------------
        [Route("Setup")]
        [HttpGet, ActionName("Setup")]
        // GET: Parametrages/Setup
        public async Task<ActionResult> Setup()
        {
            
            //RAZ de la Table paramétrage
            var rows = from o in db.Parametrages
                       select o;
            foreach (var row in rows)
            {
                db.Parametrages.Remove(row);
            }
            
            //Alimentation avec valeur du fichier de configuration
            List<string> _config = new List<string> {
                
                "QPMConfigSettings/Global/Livraison",
                "QPMConfigSettings/Global/UtilisateurModele",
                "QPMConfigSettings/Global/Fichiers",
                "QPMConfigSettings/Global/Repertoires",
                "QPMConfigSettings/Global/Environnements",

                "QPMConfigSettings/TesterDonnees/EnvironnementsList",
                "QPMConfigSettings/TesterDonnees/ModelesList",
                "QPMConfigSettings/TesterDonnees/ModelesApplicationsList"
            };

            //Attention le paramétrage doit contenir au moins 2 niveau (être dans QPMConfigSettings + un autre à définir)
            foreach (var config in _config.Where(c => c.Contains("/")))
            {
                SortedDictionary<string, string> _paramEnvironnements = GetAppParamList(config);
                foreach (var param in _paramEnvironnements)
                {
                    //ParametrageViewModel paramToCreate = new ParametrageViewModel();
                    //Parametrage bddParamToCreate = new Parametrage { ID = paramToCreate.ID, Cle = paramToCreate.Cle, Valeur = paramToCreate.Valeur, Type = paramToCreate.Type, Details = paramToCreate.Details };
                    var type = config.Substring(config.IndexOf('/')+1);
                    var details = "Date d'initialisation : " + DateTime.Now.ToString();

                    Parametrage bddParamToCreate = new Parametrage { Cle = param.Key, Valeur = param.Value, Type = type, Details=details };
                    db.Parametrages.Add(bddParamToCreate);
                }
            }

            await db.SaveChangesAsync();

            //Retour à la vue liste
            return RedirectToAction("Liste");
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        //------------------------------------------------------
        // Méthodes utilitaires
        //------------------------------------------------------
        /*****************************************************/
        //private SortedDictionary<string, string> GetSortedList(Hashtable hash)
        private SortedDictionary<string, string> GetAppParamList(string config)
        {
            SortedDictionary<string, string> sortedList = new SortedDictionary<string, string>();
            
            //Cas d'un paramétrage multi niveau dans web.conig
            if (config.Contains("/")) {
                Hashtable hash = (Hashtable)ConfigurationManager.GetSection(config);
                foreach (DictionaryEntry elem in hash)
                sortedList.Add(elem.Key.ToString(), elem.Value.ToString());
            }

            //Cas d'un paramétrage sans multi niveau dans web.conig => erreur
            else sortedList.Add("Erreur", "Vérifier la conguration du paramètre manquant");
            

            return sortedList;


        }
    }
}
