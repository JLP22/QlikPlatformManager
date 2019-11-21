using QlikPlatformManager.DAL;
using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlatformManager.Utils
{
    public class Global
    {
        public Dictionary<string, string> Livraison { get; set; }
        public Dictionary<string, string> UtilisateurModele { get; set; }
        public Dictionary<string, string> Fichiers { get; set; }
        public Dictionary<string, string> Repertoires { get; set; }
        public Dictionary<string, string> Environnements { get; set; }
        public Global()
        {
            Livraison = new Dictionary<string, string>();
            UtilisateurModele = new Dictionary<string, string>();
            Fichiers = new Dictionary<string, string>();
            Repertoires = new Dictionary<string, string>();
            Environnements = new Dictionary<string, string>();
        }
    }
    public class TesterDonnees
    {
        public Dictionary<string, string> EnvironnementsList { get; set; }
        public Dictionary<string, string> ModelesList { get; set; }
        public Dictionary<string, string> ModelesApplicationsList { get; set; }
        public TesterDonnees()
        {
            EnvironnementsList = new Dictionary<string, string>();
            ModelesList = new Dictionary<string, string>();
            ModelesApplicationsList = new Dictionary<string, string>();
        }
    }

    public class QPMConfiguration
    {
        public Global Global { get; set; }
        public TesterDonnees TesterDonnees { get; set; }

        private QPMContext db = new QPMContext();

        public QPMConfiguration()
        {
            Global = new Global();
            TesterDonnees = new TesterDonnees();

            List<Parametrage> _bddParam = db.Parametrages.ToList();
            foreach (var p in _bddParam)
            {
                //Alimentation paramètres type global
                string prefixGlobalParam = "Global";
                bool isGlobalParam = p.Type.Contains(prefixGlobalParam);
                string prefixTesterDonnees = "TesterDonnees";
                bool isPrefixTesterDonnees = p.Type.Contains(prefixTesterDonnees);

                if (isGlobalParam)
                {
                    if (p.Type.Contains(prefixGlobalParam + "/Environnements")) Global.Environnements.Add(p.Cle, p.Valeur);
                    if (p.Type.Contains(prefixGlobalParam + "/Livraison")) Global.Livraison.Add(p.Cle, p.Valeur);
                    if (p.Type.Contains(prefixGlobalParam + "/UtilisateurModele")) Global.UtilisateurModele.Add(p.Cle, p.Valeur);
                    if (p.Type.Contains(prefixGlobalParam + "/Fichiers")) Global.Fichiers.Add(p.Cle, p.Valeur);
                    if (p.Type.Contains(prefixGlobalParam + "/Repertoires")) Global.Repertoires.Add(p.Cle, p.Valeur);
                }
                else if (isPrefixTesterDonnees)
                {
                    if (p.Type.Contains(prefixGlobalParam + "/EnvironnementsList")) TesterDonnees.EnvironnementsList.Add(p.Cle, p.Valeur);
                    if (p.Type.Contains(prefixGlobalParam + "/ModelesList")) TesterDonnees.ModelesList.Add(p.Cle, p.Valeur);
                    if (p.Type.Contains(prefixGlobalParam + "/ModelesApplicationsList")) TesterDonnees.ModelesApplicationsList.Add(p.Cle, p.Valeur);
                }
            }      
        }
    }

}