using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Runtime.Caching;
using QlikPlatformManager.DAL;
using QlikUtils;
using static QlikUtils.QlikObjectJson;

namespace QlikPlatformManager.Utils
{
    public static class Common
    {
        //ListItem  : Renvoie le texte d'une valeur selectionnée
        public static string GetText(List<SelectListItem> myListItem, string mySelectedValue)
        {
            return myListItem.Where(x => x.Value == mySelectedValue).DefaultIfEmpty(new SelectListItem() { }).First().Text;
        }

        public static List<SelectListItem> ToSelectListItem(List<Serveur> _serveur)
        {
            //Création de la liste à afficher
            List<SelectListItem> serveursSelectListItem = new List<SelectListItem>();
            //Ajout d'une première valeur nulle
            SelectListItem selectListNull = new SelectListItem();
            serveursSelectListItem.Add(selectListNull);
            foreach (Serveur serveur in _serveur)
            {
                SelectListItem selectList = new SelectListItem()
                {
                    Text = serveur.Nom,
                    Value = serveur.Url.ToString()
                };
                serveursSelectListItem.Add(selectList);
            }
            return serveursSelectListItem;
        }

        public static List<SelectListItem> ToSelectListItem(List<Flux> _flux)
        {
            //Création de la liste à afficher
            List<SelectListItem> fluxSelectListItem = new List<SelectListItem>();
            if (_flux != null)
            {

                foreach (Flux flux in _flux)
                {
                    SelectListItem selectList = new SelectListItem()
                    {
                        Text = flux.Nom,
                        Value = flux.Id
                    };
                    fluxSelectListItem.Add(selectList);
                }
            }
            return fluxSelectListItem;
        }

        public static List<SelectListItem> ToSelectListItem(List<Application> _application)
        {
            //Création de la liste à afficher
            List<SelectListItem> applicationSelectListItem = new List<SelectListItem>();
            if (_application != null)
            {
                foreach (Application application in _application)
                {
                    SelectListItem selectList = new SelectListItem()
                    {
                        Text = application.Nom,
                        Value = application.Id
                    };
                    applicationSelectListItem.Add(selectList);
                }
            }
            return applicationSelectListItem;
        }

        //---------------------------------------------------------------------------------------------
        //Retourne la liste de flux pour champs liste de selection
        //---------------------------------------------------------------------------------------------
        public static List<SelectListItem> ToSelectListItem(QlikEngineConnexion qCconnexion)
        {
            //Création de la liste à afficher
            List<SelectListItem> fluxSelectListItem = new List<SelectListItem>();
            //Ajout d'une première valeur nulle
            //SelectListItem selectListNull = new SelectListItem();
            //fluxSelectListItem.Add(selectListNull);

            if (qCconnexion != null)
            {
                Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId = qCconnexion._InfosApplicationParAppId;
                //Récupère la liste des Flus de l'application (Objets Flux)
                List<Flux> _flux = GetFlux(_InfosApplicationParAppId);
                //Création de la liste à afficher
            
                if (_flux != null)
                {

                    foreach (Flux flux in _flux)
                    {
                        SelectListItem selectList = new SelectListItem()
                        {
                            Text = flux.Nom,
                            Value = flux.Id
                        };
                        fluxSelectListItem.Add(selectList);
                    }
                }
            }
            return fluxSelectListItem;
        }
        //---------------------------------------------------------------------------------------------
        //Retourne la liste de flux (objet Flux)
        //---------------------------------------------------------------------------------------------
        public static List<Flux> GetFlux(Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId)
        {
            List<Flux> _stream = new List<Flux>();
            foreach (KeyValuePair<string, QRSHubListFullJson> app in _InfosApplicationParAppId)
            {
                QRSHubListFullJson jsonApp = app.Value;
                Flux fluxItem = new Flux { Id = jsonApp.stream.id, Nom = jsonApp.stream.name };
                //Si la Stream n'est pas déjà renseignée, on l'ajoute
                if (_stream.Count()==0 || !_stream.Any(flux => flux.Id == fluxItem.Id))
                {
                    _stream.Add(fluxItem);
                }

            }
            //_Stream.Sort();
            List<Flux> _fluxOrdonne = _stream.OrderBy(o => o.Nom).ToList();
            return _fluxOrdonne;
        }

        //---------------------------------------------------------------------------------------------
        //Retourne la liste des applications pour champs liste de selection
        //---------------------------------------------------------------------------------------------
        public static List<SelectListItem> ToSelectListItem(QlikEngineConnexion qConnexion, string fluxId)
        {

            //Création de la liste à afficher
            List<SelectListItem> applicationSelectListItem = new List<SelectListItem>();
            //Ajout d'une première valeur nulle
            //SelectListItem selectListNull = new SelectListItem();
            //applicationSelectListItem.Add(selectListNull);

            if (qConnexion != null)
            {
                Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId = qConnexion._InfosApplicationParAppId;
                //Récupère la liste des applications de la stream
                List<Application> _application = GetApplications(_InfosApplicationParAppId, fluxId);
                if (_application != null)
                {
                    foreach (Application application in _application)
                    {
                        SelectListItem selectList = new SelectListItem()
                        {
                            Text = application.Nom,
                            Value = application.Id
                        };
                        applicationSelectListItem.Add(selectList);
                    }
                }
            }
            return applicationSelectListItem;
        }

        //--------------------------------------------------------------------
        //Retourne la liste d'application correspondant à la stream
        //--------------------------------------------------------------------
        public static List<Application> GetApplications(Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId, string fluxId)
        {
            List<Application> _appli = new List<Application>();
            foreach (KeyValuePair<string, QRSHubListFullJson> app in _InfosApplicationParAppId)
            {
                QRSHubListFullJson jsonApp = app.Value;
                if (fluxId == null || jsonApp.stream.id == fluxId)
                {
                    Application applicationItem = new Application { Id = jsonApp.id, Nom = jsonApp.name };
                    //Si l'application n'est pas déjà renseignée, on l'ajoute
                    if ((_appli.Count()==0 || !_appli.Any(flux => flux.Id == applicationItem.Id)))
                    {
                        _appli.Add(applicationItem);
                    }
                }
            }
            //_Appli.Sort();
            List<Application> _applicationOrdonne = _appli.OrderBy(o => o.Nom).ToList();
            return _applicationOrdonne;

        }
    }

}