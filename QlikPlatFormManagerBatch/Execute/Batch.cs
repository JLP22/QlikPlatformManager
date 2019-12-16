using System;
using System.Collections.Generic;
using System.Linq;
using QlikUtils;

namespace QlikPlatFormManagerBatch
{
    using static Utilitaires;
    using static QlikObjectJson;
    using QlikPlatformManager.Utils;

    class Batch
    {
        //----------------------------------------------------
        // Variables de classe (globale)
        //----------------------------------------------------
        //----------------------------------------------------
        // Variables d'instance
        //----------------------------------------------------
        string[] MethodeAdmises = { "archivage", "structure" };
        string Login;
        string Password;
        string DomaineConnexion;
        string Host;
        string HostName;
        string SuffixeRepertoireArchivage;
        public QlikEngineConnexion myQlik;

        //----------------------------------------------------
        // Proprietes
        //----------------------------------------------------
        public bool TraitementOk { get; set; }
        public bool IsLocalConnection { get; set; }
        // Accès aux éléments de configuration de l'applicaiton 
        private QPMConfiguration qpmConfig;
        //----------------------------------------------------
        //Constructeur
        //----------------------------------------------------
        //public Batch(Dictionary<string, string> _parametrage)
        public Batch()
        {
            //L'objet à besoin de connaitre la config à plusieurs endroits pour ses traitements
            qpmConfig = Common.QPMGetConfig();

            //Console.Clear();
            //_Parametrage = _parametrage;
            DomaineConnexion = qpmConfig.Global.UtilisateurModele["domain"];
            Login = qpmConfig.Global.UtilisateurModele["user"];
            Password = qpmConfig.Global.UtilisateurModele["password"];
            TraitementOk = false;
            SuffixeRepertoireArchivage = qpmConfig.Global.Fichiers["ArchivSuffix"];
        }
        //----------------------------------------------------
        // Lancement du batch
        //----------------------------------------------------
        public void Lancer(string[] parametre)
        {
            try
            {
                string methode = parametre[0];
                if (MethodeAdmises.Contains(methode))
                {
                    //Console.WriteLine("Lancement du batch avec la methode : " + methode + ".");
                    switch (methode)
                    {
                        case "archivage":
                            if (parametre.Length == 5)
                            {
                                if(InitAndValidateHostInfos(parametre[1]))
                                {
                                    string stream = parametre[2];
                                    string exportDirectory = parametre[3];
                                    int nbJourRetention = int.Parse(parametre[4]);
                                    //Archive les applications de la stream
                                    TraitementOk = B_Archiver(stream.Split(';').ToList(), exportDirectory, nbJourRetention);
                                }
                                else Console.WriteLine("\n /!\\ Serveur " + parametre[1] + "inconnu.\n");
                            }
                            else Console.WriteLine("\n /!\\ Nombre de parametre incorrect.\n");
                            break;
                        case "structure":
                            if (parametre.Length == 4)
                            {
                                if(InitAndValidateHostInfos(parametre[1]))
                                {
                                    string stream = parametre[1];
                                    string archiveDirectory = parametre[2];
                                    //Exporte les applications de la stream
                                    TraitementOk = B_Exporter(stream, archiveDirectory);
                                }
                                else Console.WriteLine("Serveur " + parametre[1] + "inconnu.\n");
                            }
                            else Console.WriteLine("\n /!\\ Nombre de parametre incorrect.\n");
                            break;
                        case "Chargement":
                            break;

                        case "Automatique":
                            break;

                        default:
                            Console.WriteLine("\n /!\\ Methode " + methode + " non prevue.\nFin du traitement.");
                            break;
                    }
                }
                else
                {
                    Console.WriteLine("\n /!\\ Methode " + methode + " non admise.\nFin du traitement.");
                }
                if (TraitementOk == true)
                {
                    Console.WriteLine("\n->Succes du traitement.\n");
                }
                else
                {
                    Console.WriteLine("\n-> /!\\ Echec du traitement.\n");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("\n /!\\ Erreur sur B_Archiver :" + e.Message + ".\nFin du traitement.");
            }
        }
        //----------------------------------------------------
        // Renvoir l'url du serveur
        //----------------------------------------------------
        private bool InitAndValidateHostInfos(string hostName)
        {

            if (qpmConfig.Global.Environnements.ContainsKey(hostName))
            {
                HostName = hostName;
                Host = qpmConfig.Global.Environnements[hostName];
            }
            return (!string.IsNullOrEmpty(HostName) && !string.IsNullOrEmpty(Host));

        }
        //----------------------------------------------------
        // Archivage d'application
        //----------------------------------------------------
        public bool B_Archiver(List<string> _stream, string archiveDirectory, int nbJourRetention)
        {
            try
            {

                bool etapeOK = false;
                int nbFluxTraitee = 0;
                int nbApplicationTraitee = 0;
                if (QlikConnexion())
                {
                    //Pour chaque stream de _stream
                    foreach(string streamName in _stream)
                    {
                        Console.WriteLine("\n\n-> Archivage du flux : " + streamName);
                        archiveDirectory += @"\";
                        //Recuperation des application de la stream
                        List<string> _Appli = JsonGetListeAppOfStream(streamName, myQlik._InfosApplicationParAppId);
                        foreach (string applicationName in _Appli)
                        {
                            if (!applicationName.Equals(""))
                            {
                                List<QRSHubListFullJson> _HubListApplicationJson = JsonGetListeAppliInfos(myQlik._InfosApplicationParAppId, applicationName, streamName);
                                string applicationId = _HubListApplicationJson[0].id;

                                Console.WriteLine("\n--> Traitement application : " + applicationName + " - " + applicationId);
                                string createdFile = myQlik.ArchivageApplication(applicationId, archiveDirectory, false, nbJourRetention, SuffixeRepertoireArchivage);
                                Console.WriteLine("---> Archivage .qvf application : " + applicationName + " dans: " + createdFile.Replace(" ", "%20"));
                                //Si application correctement archivée
                                if (!createdFile.Equals(""))
                                { 
                                    string exportDirectory = archiveDirectory + DateTime.Now.ToString("yyyyMMdd") + SuffixeRepertoireArchivage + "\\";
                                    
                                    //Génération du modele CSV
                                    string fullFileName = myQlik.CsvCreateExport(applicationId, exportDirectory);
                                    Console.WriteLine("---> Export modele .csv application " + applicationName + " dans: " + fullFileName.Replace(" ", "%20"));
                                    //Génération du modele JSON
                                    fullFileName = myQlik.JsonCreateExport(applicationId, exportDirectory, true);
                                    Console.WriteLine("---> Export modele .json application " + applicationName + " dans: " + fullFileName.Replace(" ", "%20"));
                                    //Copie du JSON dans le répertoire du script de l'application
                                    //Récupère chemin déclaré dans l'application Qlik EX : $(Include='lib://$(vEnv)/applications/ventes-distrimex/main.qvs');
                                    string scriptFullPath = myQlik.GetScriptDirectory(applicationId, true);
                                    string dirEnv = (applicationName.Contains("(prod)") ? qpmConfig.Global.Repertoires["dirEnvProd"] : (applicationName.Contains("(recette)") ? qpmConfig.Global.Repertoires["dirEnvRec"] : qpmConfig.Global.Repertoires["dirEnvDev"]));
                                    string dirQsdata = qpmConfig.Global.Livraison["svnLocalDefaut1"].Split('\\')[1];
                                    string appDirectory = scriptFullPath.Replace("lib://$(vEnv)", "\\\\" + HostName + "\\" + dirQsdata + "\\" + dirEnv).Split(new string[]{"main.qvs"}, StringSplitOptions.None)[0];
                                    appDirectory = appDirectory.Replace("/", "\\");
                                    string sourceFileName = fullFileName.Replace(exportDirectory, "");
                                    string targetFileName = "layout.json";
                                    fullFileName = CopyFile(exportDirectory, sourceFileName, appDirectory, targetFileName);
                                    string fullPathLayoutJson = appDirectory + targetFileName;
                                    Console.WriteLine("---> Export modele .json application " + applicationName + " dans : " + fullPathLayoutJson.Replace(" ", "%20"));
                                    //SVN Commit du fichier Layout.json
                                    bool isSuccess = false;
                                    Dictionary<string, string> _tortoise;
                                    //Ajout du fichier dans SVN
                                    _tortoise = new Dictionary<string, string>();
                                    _tortoise.Add("command", "add");
                                    _tortoise.Add("option", "--force");
                                    _tortoise.Add("path", fullPathLayoutJson);
                                    //isSuccess = RunBatchScript("TortoiseProc.exe", _tortoise);
                                    isSuccess = RunBatchScript("svn", _tortoise);
                                    //Commit du fichier
                                    if (isSuccess)
                                    {
                                        _tortoise = new Dictionary<string, string>();
                                        //_tortoise.Add("command", "commit");
                                        _tortoise.Add("command", "commit");
                                        _tortoise.Add("path", fullPathLayoutJson);
                                        _tortoise.Add("option", "-m \"archivage du layout en batch\"");
                                        //_tortoise.Add("path", fullPathLayoutJson + " -m \"archivage du layout en batch\"");
                                        //isSuccess = RunBatchScript("TortoiseProc.exe", _tortoise);
                                        isSuccess = RunBatchScript("svn", _tortoise);

                                        if (isSuccess)
                                        {
                                            Console.WriteLine("---> Commit modele .json " + fullPathLayoutJson + " réalisé avec succès.");
                                        }
                                        else Console.WriteLine("---> /!\\ SVN - Commit modele .json " + fullPathLayoutJson + " en erreur. /!\\");
                                    }
                                    else Console.WriteLine("---> /!\\ SVN - Add modele .json " + fullPathLayoutJson + " en erreur. /!\\");
                                    
                                }
                                nbApplicationTraitee++;
                            }
                        }
                        nbFluxTraitee++;
                    }
                    Console.WriteLine("\n\n-> **Synthese execution**");
                    Console.WriteLine("Nombre flux traites = " + nbFluxTraitee);
                    Console.WriteLine("Nombre applications traitees = " + nbApplicationTraitee);
                    etapeOK = true;
                }
                else etapeOK = false;

                return etapeOK;
            }
            catch (Exception e)
            {
                Console.WriteLine("\n /!\\ Erreur sur B_Archiver : " + e.Message + ".\nFin du traitement.");
                return false;
            }
        }
        //----------------------------------------------------
        // Export d'application
        //----------------------------------------------------
        public bool B_Exporter(string stream, string exportDirectory)
        {
            try
            {
                bool etapeOK = false;
                int nbApplicationTraitee = 0;
                if (QlikConnexion())
                {
                    //Recuperation des application de la stream
                    List<string> _Appli = JsonGetListeAppOfStream(stream, myQlik._InfosApplicationParAppId);
                    foreach (string applicationName in _Appli)
                    {
                        if (!applicationName.Equals(""))
                        {
                            nbApplicationTraitee++;
                            List<QRSHubListFullJson> _HubListApplicationJson = JsonGetListeAppliInfos(myQlik._InfosApplicationParAppId, applicationName, stream);
                            string applicationId = _HubListApplicationJson[0].id;

                            Console.WriteLine("\nExport modele application : " + applicationName + "  -  " + applicationId);


                            /*List<string> _fullFileName = myQlik.ExportModeleApplication(applicationId, exportDirectory);
                            if (_fullFileName.Count() < 1) Console.WriteLine("\n\nExport du modèle en erreur...");
                            else
                            {
                                foreach (var fullFileName in _fullFileName)
                                {
                                    Console.WriteLine("\nFichier exporté : " + "file://" + fullFileName.Replace(" ", "%20"));
                                }
                                Console.WriteLine("\n\nExport du modèle terminé !");
                            }*/
                            string fullFileName = myQlik.CsvCreateExport(applicationId, exportDirectory);
                            Console.WriteLine("\nExport modele réalisé dans: " + fullFileName.Replace(" ", " % 20"));

                        }
                    }
                    Console.WriteLine("Nombre d'application traitee = " + nbApplicationTraitee + ".\n");
                    etapeOK = true;
                }
                else etapeOK = false;

                return etapeOK;
            }
            catch (Exception e)
            {
                Console.WriteLine("\n /!\\ Erreur sur B_Exporter : " + e.Message + ".\nFin du traitement.");
                return false;
            }
        }
        //----------------------------------------------------
        // Export d'application
        //----------------------------------------------------
        public bool QlikConnexion()
        {
            try
            {
                myQlik = new QlikEngineConnexion(Host, HostName, DomaineConnexion, Login, Password, myQlik);
                
                myQlik.InitListeApplication(qpmConfig.Global.Repertoires["ImportDirectory"]);
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine("Erreur de connexion au moteur du serveur " + Host + " avec l'utilisateur " + DomaineConnexion + "\\" + Login + ".\n");
                Console.WriteLine("Details : " + e.Message + ".\nFin du traitement.\n");
                return false;
            }
        }
    }
}

