using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlatformManager.DAL
{
    public interface IDal : IDisposable
    {
        List<Serveur> ObtenirListeServeurs();
        List<Historique> ObtenirListeHistoriques();
        List<Flux> ObtenirListeFlux();
        List<Application> ObtenirListeApplications();
       
    }
}