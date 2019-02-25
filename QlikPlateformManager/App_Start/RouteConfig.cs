using QlikPlateformManager.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace QlikPlateformManager
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

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
