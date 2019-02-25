using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlateformManager.Models
{
    public class DalEnDur : IDal
    {
        private List<Serveur> listeServeurs;
        private List<Flux> listeFlux;
        private List<Application> listeApplications;


        //Constructeur
        public DalEnDur()
        {

            //Utilistation Bdd chargé en mémoire
            listeServeurs = Bdd._Serveurs;
            listeFlux = Bdd._Flux;
            listeApplications = Bdd._Applications;

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

        public void Dispose()
        {
            listeServeurs = new List<Serveur>();
            listeFlux = new List<Flux>();
            listeApplications = new List<Application>();
        }
    }
}