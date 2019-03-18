using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.Controllers
{
    public class AfficherController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Accueil";
            ViewBag.Message = "Fonctionnalités de l'application";
            return View();
        }

        public ActionResult Documentation()
        {
            ViewBag.Title = "Documentation";
            ViewBag.Message = "Manuel utilisateur";
            return View();
        }

        public ActionResult Liens()
        {
            ViewBag.Title = "Liens";
            ViewBag.Message = "Liens externes";
            return View();
        }
    }
}