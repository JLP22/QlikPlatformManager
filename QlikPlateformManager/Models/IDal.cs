using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlateformManager.Models
{
    public interface IDal : IDisposable
    {
        List<Serveur> ObtenirListeServeurs();
        List<Flux> ObtenirListeFlux();
        List<Application> ObtenirListeApplications();
        //void AjouterLivre(string titre, string dateParution, Auteur auteur);
    }
}