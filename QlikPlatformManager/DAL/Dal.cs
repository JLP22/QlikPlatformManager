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
        //private List<Flux> listeFlux;
        //private List<Application> listeApplications;


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

            List<Flux> listeFlux = new List<Flux>{
                new Flux { Id = "1", Nom = "Dev.Ventes" }
            };
            return listeFlux;
        }

        //---------------------------------------------------------------------
        // Recherche tous les serveurs
        //---------------------------------------------------------------------
        public List<Application> ObtenirListeApplications()
        {
            List<Application> listeApplications = new List<Application>{
                new Application { Id = "ea099413-3c1d-45e0-8874-fa46e1df7ff1", Nom = "AELIA"},
                new Application { Id = "dc878ecd-887b-4c47-8e33-25d440d64441", Nom = "Chiffres GERS (dev)"},
                new Application { Id = "xxxxxxxx", Nom = "Erreur"}
            };
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