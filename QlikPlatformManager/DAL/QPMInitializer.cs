using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using QlikPlatformManager.Models;

namespace QlikPlatformManager.DAL
{
    //TO DO : à remplacer par "Migrations Code First" pour la prod
    //Suppression et recréation de la base à chaque fois que le modèle change
    public class QPMInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<QPMContext>
    {
        //Seed = Appel auto après création de la BDD pour alimentation données de test ou initialisation
        protected override void Seed(QPMContext context) 
        {
            // --------- Serveurs ---------
            List<Serveur> serveurs = new List<Serveur>{
                    new Serveur { Id = "1", Nom = "SRV99BI" , Url =  @"http://bi.cerpba.int", Description = "Développement"},
                    new Serveur { Id = "2", Nom = "SRV02BI" , Url =  @"http://bi.cerpba.com", Description = "Recette/Prod"},
                    new Serveur { Id = "3", Nom = "Desktop" , Url =  @"http://localhost:4848", Description = "Machine locale"},
                    new Serveur { Id = "4", Nom = "LocalDB" , Url =  @"http://localhost:4848", Description = "Local DB"}
            };
            serveurs.ForEach(s => context.Serveurs.Add(s));

            // --------- Historique ---------
            List<Historique> historiques = new List<Historique>{
                    new Historique { ID = 0, Utilisateur = "jlepouliq" , Origine = "Archiver/Application", Type =  "Connection", Details = "Archiver sur ....", Date = DateTime.Now, Statut = "OK"},
                    new Historique { ID = 1, Utilisateur = "bvalliere" , Origine = "Afficher/Application", Type =  "Connection", Details = "Afficher les applications", Date = DateTime.Now, Statut = "KO"}
            };
            historiques.ForEach(s => context.Historiques.Add(s));

            context.SaveChanges();

        }
    }
}