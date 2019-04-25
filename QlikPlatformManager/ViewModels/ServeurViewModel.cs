using System.Security;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    //View model utilisé lorsque la sélection d'un serveur + flux + application est demandée
    public class ServeurViewModel
    {
        //Constructeur
        public ServeurViewModel()
        {
        }

        //Propriétés

        //-- Serveurs
        //Liste des serveurs
        public List<SelectListItem> _Serveur { get; set; }
        //Serveur sélectionné
        [Display(Name = "Serveur")]
        [Required(ErrorMessage = "Le serveur doit être sélectionné")]
        public string Serveur { get; set; }
        //Infos du serveur sélectionné
        public string ServeurInfos { get; set; }

        //-- Flux
        //Liste des flux
        public List<SelectListItem> _Flux { get; set; }
        //Flux sélectionné
        [Display(Name = "Flux")]
        [Required(ErrorMessage = "Le flux doit être sélectionné")]
        public string Flux { get; set; }
        //Infos du flux sélectionné
        public string FluxInfos { get; set; }

        //-- Applications
        //Liste des applications
        public List<SelectListItem> _Application { get; set; }
        //Application sélectionnée
        [Display(Name = "Application")]
        [Required(ErrorMessage = "L'application doit être sélectionnée")]
        public string Application { get; set; }
        //Infos par Id d'application
        public Dictionary<string,string> ApplicationsInfos { get; set; }

        //--Autres
        //connexion établit par le formulaire
        public QlikEngineConnexion QEngineConnexion { get; set; }
        //Détails de la connexion établit par le formulaire
        public ResultsViewModel Results = new ResultsViewModel();
        //Nom de la connexion utilisateur
        public string UserConnexion;

        //Méthodes

        //-----------------------------------------------------------------------
        // Alimentation des select Serveur / Flux / Application
        //-----------------------------------------------------------------------
        public void PopulateList(IDal dal)
        {
            //Liste serveur
            string listName = "serveurList";
            _Serveur = (List<SelectListItem>)Common.GetObjectInCache(listName);
            if (_Serveur == null)
            {
                _Serveur = Common.ToSelectListItem(dal.ObtenirListeServeurs());
                Common.SetObjectInCache(listName, _Serveur);
            }

            //Liste flux et application
            if (QEngineConnexion != null)
            {
                //Recherche liste des Stream par application
                //Collection renvoyées (clé soit Id, soit Name et value = objet issu du JSON)
                QEngineConnexion.InitListeApplication();
                ServeurInfos = QEngineConnexion.GetHtmlServeurInfos();
            }

            //Liste Streams
            _Flux = Common.ToSelectListItem(QEngineConnexion);
            //Liste applications
            _Application = Common.ToSelectListItem(QEngineConnexion, Flux);

            //Ajout des info bulle sur la coche
            if (!string.IsNullOrEmpty(Flux))
            {
                string fluxName = _Flux.Where(x => x.Value == Flux).DefaultIfEmpty(new SelectListItem() { }).First().Text;
                FluxInfos = QEngineConnexion.GetHtmlFluxInfos(fluxName);
                ApplicationsInfos = QEngineConnexion.GetHtmlApplicationsInfos(fluxName);
            }
        }
        //-----------------------------------------------------------------------
        // Connection au serveur Qlik 
        //-----------------------------------------------------------------------
        public void Connect(string userPortail)
        {
            UserConnexion = "Connexion_" + userPortail + "_" + Serveur;

            QEngineConnexion = (QlikEngineConnexion)Common.GetObjectInCache(UserConnexion);
            if (QEngineConnexion != null) Results.addDetails("Connexion au serveur via la connexion trouvée en cache " + UserConnexion);
            if (QEngineConnexion != null && QEngineConnexion.Host != Serveur) QEngineConnexion.PurgeConnexion();
            if (QEngineConnexion == null || QEngineConnexion.Host != Serveur)
            {
                //Création de la connexion
                bool isLocalConnection = false;
                Results.addDetails("Connexion au serveur en attente");
                QEngineConnexion = new QlikEngineConnexion(Serveur, "CERPBN", "biadm", "ezabrhBm", QEngineConnexion, isLocalConnection);
                Results.addDetails("Connexion au serveur réussie");
                //Mise en cache de la connexion
                Common.SetObjectInCache(UserConnexion, QEngineConnexion);
                Results.addDetails("Connexion " + UserConnexion + " mise en cache");
            }
        }
    }
}