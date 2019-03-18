using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlatformManager.DAL
{
    public class DalEnDur : IDal
    {
        private List<Serveur> listeServeurs;
        private List<Flux> listeFlux;
        private List<Application> listeApplications;
        private List<Historique> listeHistoriques;


        //Constructeur
        public DalEnDur()
        {

            //Utilistation Bdd chargé en mémoire
            listeServeurs = BddEnDur._Serveurs;
            listeFlux = BddEnDur._Flux;
            listeApplications = BddEnDur._Applications;
            listeHistoriques = BddEnDur._Historiques;

        }

        //---------------------------------------------------------------------
        // Recherche tous les serveurs
        //---------------------------------------------------------------------
        public List<Serveur> ObtenirListeServeurs()
        {
            return listeServeurs;
        }

        //---------------------------------------------------------------------
        // Recherche tous les serveurs
        //---------------------------------------------------------------------
        public List<Flux> ObtenirListeFlux()
        {
            return listeFlux;
        }

        //---------------------------------------------------------------------
        // Recherche tous les serveurs
        //---------------------------------------------------------------------
        public List<Application> ObtenirListeApplications()
        {
            return listeApplications;
        }

        //---------------------------------------------------------------------
        // Recherche tous les serveurs
        //---------------------------------------------------------------------
        public List<Historique> ObtenirListeHistoriques()
        {
            return listeHistoriques;
        }

        public void Dispose()
        {
            //listeServeurs = new List<Serveur>();
            listeFlux = new List<Flux>();
            listeApplications = new List<Application>();
        }
    }
}