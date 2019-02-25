﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlateformManager.Models
{
    public class Bdd
    {

        // --------- Serveurs ---------
        private static List<Serveur> _serveurs = new List<Serveur>{
                new Serveur { Id = "1", Nom = "SRV99BI" , Url =  @"http://bi.cerpba.int", Description = "Développement"},
                new Serveur { Id = "2", Nom = "SRV02BI" , Url =  @"http://bi.cerpba.com", Description = "Recette/Prod"},
                new Serveur { Id = "3", Nom = "Desktop" , Url =  @"http://localhost:4848", Description = "Machine locale"}
        };
        // read-write variable
        public static List<Serveur> _Serveurs
        {
            get
            {
                return _serveurs;
            }
            set
            {
                _serveurs = value;
            }
        }

        //TODO : A supprimer car valorisé par Qlik
        // --------- Flux ---------
        private static List<Flux> _flux = new List<Flux>{
                new Flux { Id = "1", Nom = "Dev.Ventes"}
        };
        // read-write variable
        public static List<Flux> _Flux
        { 
            get
            {
                return _flux;
            }
            set
            {
                _flux = value;
            }
        }

        //TODO : A supprimer car valorisé par Qlik
        // --------- Application ---------
        private static List<Application> _applications = new List<Application>{
                new Application { Id = "ea099413-3c1d-45e0-8874-fa46e1df7ff1", Nom = "AELIA"},
                new Application { Id = "dc878ecd-887b-4c47-8e33-25d440d64441", Nom = "Chiffres GERS (dev)"}
        };
        // read-write variable
        public static List<Application> _Applications
        {
            get
            {
                return _applications;
            }
            set
            {
                _applications = value;
            }
        }


    }
}