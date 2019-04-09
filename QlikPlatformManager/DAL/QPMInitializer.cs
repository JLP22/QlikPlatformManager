﻿using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using QlikPlatformManager.Models;

namespace QlikPlatformManager.DAL
{
    //TO DO : à remplacer par "Migrations Code First" pour la prod
    //Suppression et recréation de la base à chaque fois que le modèle change
    //public class QPMInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<QPMContext>
    public class QPMInitializer : System.Data.Entity.DropCreateDatabaseAlways<QPMContext>
    {
        //Seed = Appel auto après création de la BDD pour alimentation données de test ou initialisation
        protected override void Seed(QPMContext context) 
        {
            // --------- Serveurs ---------
            List<Serveur> serveurs = new List<Serveur>{
                    new Serveur { Id = "1", Nom = "SRV99BI" , Url =  @"http://bi.cerpba.int", Description = "Développement"},
                    new Serveur { Id = "2", Nom = "SRV02BI" , Url =  @"http://bi.cerpba.com", Description = "Recette/Prod"}
            };
            serveurs.ForEach(s => context.Serveurs.Add(s));

            //List<Flux> flux = new List<Flux>{
            //    new Flux { Id = "1", Nom = "Dev.Ventes" }
            //};
            //flux.ForEach(s => context.Streams.Add(s));

            //List<Application> applications = new List<Application>{
            //    new Application { Id = "ea099413-3c1d-45e0-8874-fa46e1df7ff1", Nom = "AELIA"},
            //    new Application { Id = "dc878ecd-887b-4c47-8e33-25d440d64441", Nom = "Chiffres GERS (dev)"},
            //    new Application { Id = "xxxxxxxx", Nom = "Erreur"}
            //};
            //applications.ForEach(s => context.Applications.Add(s));


            //Jeu de données pour l'environement de dev
            if (ConfigurationManager.AppSettings["Environment"]== "Dev")
            {
                // --------- Historique ---------
                List<Historique> historiques = new List<Historique>{
                        new Historique { ID = 0, Utilisateur = "jlepouliq" , Origine = "Archiver/Application", Type =  "Connection", Details = "Archiver sur ....", Date = DateTime.Now, Statut = "OK"},
                        new Historique { ID = 1, Utilisateur = "bvalliere" , Origine = "Afficher/Application", Type =  "Connection", Details = "Afficher les applications", Date = DateTime.Now, Statut = "KO"}
                };
                historiques.ForEach(s => context.Historiques.Add(s));
            }

            context.SaveChanges();

        }
    }
}