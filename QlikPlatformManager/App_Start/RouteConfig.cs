using QlikPlatformManager.Controllers;
using System.Web.Mvc;
using System.Web.Routing;

namespace QlikPlatformManager
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Utilisation routing par attribut
            routes.MapMvcAttributeRoutes();

            /*routes.MapRoute(
              name: "AnalyserActiviteEdit",
              url: "Analyser/Edit/{id}",
              defaults: new { controller = "Analyser", action = "Edit", id = UrlParameter.Optional },
              constraints: new { action = new RouteTestController() } //Permet de vérifier que le controlleur/action existe bien
              );

            routes.MapRoute(
              name: "AnalyserActiviteDetails",
              url: "Analyser/Details/{id}",
              defaults: new { controller = "Analyser", action = "Details", id = UrlParameter.Optional },
              constraints: new { action = new RouteTestController() } //Permet de vérifier que le controlleur/action existe bien
              );

            routes.MapRoute(
              name: "AnalyserActivite",
              url: "Analyser/Activite",
              defaults: new { controller = "Analyser", action = "Activite" },
              constraints: new { action = new RouteTestController() } //Permet de vérifier que le controlleur/action existe bien
              );
              */
            routes.MapRoute(
              name: "ArchiverApplication",
              url: "Archiver/Application",
              defaults: new { controller = "Archiver", action = "Application" },
              constraints: new { action = new RouteTestController() } //Permet de vérifier que le controlleur/action existe bien
              );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Afficher", action = "Index", id = UrlParameter.Optional },
                constraints: new { action = new RouteTestController() } //Permet de vérifier que le controlleur/action existe bien
            );

            //Route employée si aucune précédente trouvée
            routes.MapRoute(
                "PageNotFound", // Route name
                "{*catchall}", // URL with parameters
                new { controller = "Error", action = "NotFound" }       // Affichage page erreur
                //new { controller = "Afficher", action = "Livres" }    //Affichage page accueil
            );
        }
    }
}
