using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlatformManager.DAL
{
    public class Dal : IDal
    {
        private QPMContext bdd;
        private List<Flux> listeFlux;
        private List<Application> listeApplications;


        public Dal()
        {
            bdd = new QPMContext();
            //listeFlux = BddEnDur._Flux;
            //listeApplications = BddEnDur._Applications;
        }

        //---------------------------------------------------------------------
        // Recherche tous les serveurs
        //---------------------------------------------------------------------
        public List<Serveur> ObtenirListeServeurs()
        {
            return bdd.Serveurs.ToList();
        }

        //---------------------------------------------------------------------
        // Recherche tous les logs
        //---------------------------------------------------------------------
        public List<Historique> ObtenirListeHistoriques()
        {
            return bdd.Historiques.ToList();
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
        //Libère Bdd
        //---------------------------------------------------------------------
        public void Dispose()
        {
            bdd.Dispose();
        }

    }
}