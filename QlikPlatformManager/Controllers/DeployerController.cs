using QlikPlatformManager.DAL;
using QlikPlatformManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.Controllers
{
    public class DeployerController : Controller
    {
        //Pour eviter des using dans le corps de l'action (factorise dal)
        private IDal Dal;

        //Utile pour le cas normal
        public DeployerController() : this(new Dal())
        {
        }

        //Si un Idal est passé en paramètre au constructeur, on l'utilise 
        //utile pour les tests DalEnDur
        public DeployerController(IDal dalIoc)
        {
            Dal = dalIoc;
        }

        // GET: Deployer
        public ActionResult Application()
        {
            //Création du viewModel d'archivage de la structure des applications
            DeployerApplicationViewModel deployerStructureViewModel = new DeployerApplicationViewModel();
            //Alimentation des listes du formulaire (serveur, flux et source)
            deployerStructureViewModel.ServeurSource.Connexion.PopulateList(Dal, true);
            deployerStructureViewModel.ServeurCible.Connexion.PopulateList(Dal, true);

            return View(deployerStructureViewModel);
        }

        [HttpPost]
        [ActionName("Application")]
        public ActionResult ApplicationPost(DeployerApplicationViewModel deployerApplicationViewModel)
        {
            bool isValidGlobalModel = ModelState.IsValid;
            ServeurViewModel deployerConnexionSource = deployerApplicationViewModel.ServeurSource.Connexion;
            ServeurViewModel deployerConnexionCible = deployerApplicationViewModel.ServeurCible.Connexion;

            deployerConnexionSource.ServeurInfos = "";
            deployerConnexionCible.ServeurInfos = "";

            try
            {

                //Connection au serveur de référence
                if (!string.IsNullOrEmpty(deployerApplicationViewModel.ServeurSource.Connexion.Serveur))
                {
                    deployerConnexionSource.Connect(User.Identity.Name);
                    deployerApplicationViewModel.Results = deployerConnexionSource.Results;
                }

                //Connection au serveur de comparaison
                if (!string.IsNullOrEmpty(deployerApplicationViewModel.ServeurCible.Connexion.Serveur))
                {
                    deployerConnexionCible.Connect(User.Identity.Name);
                    deployerApplicationViewModel.Results = deployerConnexionCible.Results;
                }

                //Alimentation des listes du formulaire (serveur, flux et source)
                deployerApplicationViewModel.ServeurSource.Connexion.PopulateList(Dal, true);
                deployerApplicationViewModel.ServeurCible.Connexion.PopulateList(Dal, true);

                //Retour à la vue si ni flux, ni application sélectionnée
                if (!isValidGlobalModel) deployerApplicationViewModel.Results.Title = "";

                //Lancement de la livraison
                else deployerApplicationViewModel.Livrer();


                //Retour à la vue
                return PartialView(deployerApplicationViewModel);

            }
            catch (Exception e)
            {
                deployerApplicationViewModel.ServeurSource.Connexion.ServeurInfos = "";
                deployerApplicationViewModel.ServeurCible.Connexion.ServeurInfos = "";
                deployerApplicationViewModel.Results.Title = "Déploiement KO";
                deployerApplicationViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                deployerApplicationViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(deployerApplicationViewModel);
            }
        }
    }
}