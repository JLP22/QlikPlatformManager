using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Models;

namespace QlikPlatformManager.Controllers
{
    [RoutePrefix("Analyser")]
    public class AnalyserController : Controller
    {
        private QPMContext db = new QPMContext();

        // GET: Analyser
        [Route("Activite")]
        public ActionResult Activite()
        {
            return View(db.Historiques.ToList());
        }

        // GET: Analyser/Details/5
        [Route("Activite/{id?}")]
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Historique historique = db.Historiques.Find(id);
            if (historique == null)
            {
                return HttpNotFound();
            }
            return View(historique);
        }

        [Route("Create")]
        // GET: Analyser/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Analyser/Create
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("Create")]
        public ActionResult Create([Bind(Include = "ID,Utilisateur,Origine,Type,Details,Statut,Date")] Historique historique)
        {
            if (ModelState.IsValid)
            {
                db.Historiques.Add(historique);
                db.SaveChanges();
                return RedirectToAction("Activite");
            }

            return View(historique);
        }

        // GET: Analyser/Edit/5
        [Route("Edit/{id?}")]
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Historique historique = db.Historiques.Find(id);
            if (historique == null)
            {
                return HttpNotFound();
            }
            return View(historique);
        }

        // POST: Analyser/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("Edit")]
        public ActionResult Edit([Bind(Include = "ID,Utilisateur,Origine,Type,Details,Statut,Date")] Historique historique)
        {
            if (ModelState.IsValid)
            {
                db.Entry(historique).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Activite");
            }
            return View(historique);
        }

        // GET: Analyser/Delete/5
        [Route("Delete/{id?}")]
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Historique historique = db.Historiques.Find(id);
            if (historique == null)
            {
                return HttpNotFound();
            }
            return View(historique);
        }

        // POST: Analyser/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Route("Delete/{id}")]
        public ActionResult DeleteConfirmed(int id)
        {
            Historique historique = db.Historiques.Find(id);
            db.Historiques.Remove(historique);
            db.SaveChanges();
            return RedirectToAction("Activite");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
