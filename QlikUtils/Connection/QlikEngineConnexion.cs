using Qlik.Sense.RestClient;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security;
using Newtonsoft.Json;
using Qlik.Engine;
using Qlik.Sense.Client;
using Qlik.Engine.Communication;
using static QlikUtils.Utilitaires;

namespace QlikUtils
{
    using Qlik.Sense.Client.Visualizations;
    using System.Configuration;
    using System.Diagnostics;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Security.Cryptography.X509Certificates;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using static QlikObjectJson;
    using static Utilitaires;

    
    public class QlikEngineConnexion
    {
        
        public String Host { get; set; }
        public String HostName { get; set; }
        public String Domain { get; set; }
        public String UserId { get; set; }
        public String Password { get; set; }
        public SecureString SecurePassWord;
        //public Boolean IsLocalConnection { get; set; }

        public String Xrfkey { get; set; }

        public String EngineVersion { get; set; }
        public String NbActiveUser { get; set; }
        public String NbTotalUser { get; set; }
        public String OsVersion { get; set; }
        public String SessionSDK { get; set; }
        public String SessionREST { get; set; }
        public String MessageErreur { get; set; }
        public ILocation Location { get; set; }
        public IApp Application { get; set; }
        public string ImportDirectory { get; set; }
        public RestClient RestClient { get; set; }
        public Boolean ServerMode { get; set; }

        //Liste des applications liées à la connexion
        public Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId { get; set; }

        //utilisé pour ramener objets IApp et IAppIdentifier d'un Id d'application
        private class MyAppDescription
        {
            public IApp application { get; set; } //doc class
            public IAppIdentifier appIdentifier { get; set; } //Identifier unique de l'applicaton
            public int numero { get; set; }
            public int nombreTotal { get; set; }
            public IEnumerable<NxInfo> json { get; set; }
            public MyAppStructure structure { get; set; }
        }
        
        //---------------------------------------------------------------
        //Constructeur
        //---------------------------------------------------------------
        //public QlikEngineConnexion(string host, string hostName, string domain, string userId, string password, QlikEngineConnexion oldConnexion, bool isLocalConnection)
        public QlikEngineConnexion(string host, string hostName, string domain, string userId, string password, QlikEngineConnexion oldConnexion)
        {
            
            //Purge connections précédentes si nécessaire
            if (oldConnexion != null && oldConnexion.Host != host) oldConnexion.PurgeConnexion();

            //Initialisation objet
            Host = host;
            HostName = hostName;
            Domain = domain;
            UserId = userId;
            Password = password;
            SecurePassWord = new SecureString();
            foreach (char car in password)
            {
                SecurePassWord.AppendChar(car);
            }
            //IsLocalConnection = isLocalConnection;
            //System.Windows.Forms.MessageBox.Show("1- Domain = " + Domain + "\nUserId=" + UserId + "\nPassword=" + Password);
            MessageErreur = "";
            Xrfkey = "0123456789abcdef";
            _InfosApplicationParAppId = new Dictionary<string, QRSHubListFullJson>();
            ImportDirectory = "";

            //var devServerUrl = ConfigurationManager.AppSettings["Dev"];
            //var rec_prodServerUrl = ConfigurationManager.AppSettings["Rec-Prod"];

            //if (Host == devServerUrl || Host == rec_prodServerUrl)
            if (!Host.ToLower().Contains("localhost"))
            {
                ServerMode = true;
                RestClient = new RestClient(Host, Domain, UserId, Password);
            }
            else ServerMode = false;


            //Connexion Qlik
            Connect();
        }

        //---------------------------------------------------------------
        //Connexion au serveur via SDK
        //---------------------------------------------------------------
        public void ConnectToServer()
        {
            bool isConnectionOk = false;
            try
            {
                if (!Location.IsAlive())
                {

                    Uri uri = new Uri(Host + ":4747");
                    Location = Qlik.Engine.Location.FromUri(uri);
                    X509Certificate2Collection x509coll = GetCertificate(Host);
                    Location.AsDirectConnection(Domain, UserId, false, false, x509coll);
                    //Location.AsDirectConnection(Domain, UserId, certificateValidation: true, certificateCollection: x509coll);

                    //Directly to a local Qlik Sense with a certificate
                    //if (this.IsLocalConnection)
                    //{

                    //    /*
                    //    //Connection non fonctionnelle 
                    //    //mais devrait être utilisée pour une connection en local sur le serveur                        
                    //    Uri uri = new Uri(Host + ":4747");
                    //    Location = Qlik.Engine.Location.FromUri(uri);
                    //    Location.AsDirectConnection(Domain, UserId);*/

                    //    /*
                    //    //Connection d'origine NTLM
                    //    Uri uri = new Uri(Host);
                    //    Location = Qlik.Engine.Location.FromUri(uri);
                    //    NetworkCredential networkCredential = new NetworkCredential(UserId, SecurePassWord, Domain);
                    //    Location.AsNtlmUserViaProxy(proxyUsesSsl: uri.Scheme.Equals(Uri.UriSchemeHttps), loginCredentials: networkCredential, certificateValidation: false);
                    //    Location.IsVersionCheckActive = false;
                    //    */
                    //}
                    ////Directly to a remote Qlik Sense with a certificate
                    //else
                    //{
                    //    /* Connection fonctionne et utilisée avant If peut importe si connection serveur local ou remote
                    //    //Uri uri = new Uri("https://srv99bi" + ":4747");
                    //    Uri uri = new Uri(Host + ":4747");
                    //    Location = Qlik.Engine.Location.FromUri(uri);
                    //    X509Certificate2Collection x509coll = GetCertificate(Host);
                    //    Location.AsDirectConnection(Domain, UserId, false, false, x509coll);
                    //    */
                    //}
                        
                    using (IHub hub = Location.Hub())
                    {
                        //Maj indicateur de connexion réussie
                        isConnectionOk = true;
                        Dictionary<string, string> _detailsHealth = QEngineHealthInfo();
                        NbActiveUser = _detailsHealth["activeUser"];
                        NbTotalUser = _detailsHealth["totalUser"];
                        EngineVersion = hub.EngineVersion().ComponentVersion;
                        EngineVersion += " [" + hub.QTProduct() + "]";
                        OsVersion = hub.OSName();
                        OsVersion += " [" + hub.OSVersion() + "]";
                        if(String.IsNullOrEmpty(Location.SessionCookie)) SessionSDK = "Connexion par certificat";
                        else SessionSDK = Location.SessionCookie;
                    }
                    //Console.WriteLine("Cookie = " + Location.SessionCookie);
                }
            }
            catch (Exception ex)
            {                  
                    MessageErreur = "Erreur lors de la connexion au serveur: " + Host + ".\n" + ex.Message;
                    throw;
            }
     
            //Si aucune tentative de connexion n'a abouti => lever exception
            if (!isConnectionOk)
            {
                //MessageErreur = "Aucune connexion au serveur (" + Host + ") aboutit après "+ nbConnectionAttemptMax + " tentatives.\n Vérifier user/mdp.\nEssayer à nouveau dans 2 minutes.\n";
                MessageErreur = "La connexion au serveur (" + Host + ") n'a pas abouti.\n Cas 1 : vérifier user/mdp.\n Cas 2 : Si nombre max de sessions concurrentes atteint (5) pour l'utilisateur, essayer à nouveau dans 2 minutes.\n";
                //throw new ArgumentException(MessageErreur, "Qlik.Engine - Connection lost.");
                throw new ArgumentException("", "");
            }
            
        }
        //---------------------------------------------------------------
        //Connexion au desktop
        //---------------------------------------------------------------
        public void ConnectToLocalHost()
        {
            try
            {
                Debug.WriteLine("Connexion locale");
                Location = Qlik.Engine.Location.FromUri(new Uri(Host));
                Location.AsDirectConnectionToPersonalEdition();
                Location.IsVersionCheckActive = false;
                using (IHub hub = Location.Hub())
                {
                    NbActiveUser = "1";
                    NbTotalUser = "1";
                    EngineVersion = hub.EngineVersion().ComponentVersion;
                    EngineVersion += " [" + hub.QTProduct() + "]";
                    OsVersion = hub.OSName();
                    OsVersion += " [" + hub.OSVersion() + "]";
                }
            }
            catch (CommunicationErrorException cex)
            {
                MessageErreur = "Impossible de se connecter, vérifier que la version desktop est démarrée ." + Environment.NewLine + cex.Message + ".\n";
                throw;
            }
            catch (Exception ex)
            {
                MessageErreur = "Erreur générale dans ConnectToLocalHost.\n" + ex.Message + ".\n";
                throw;
            }
        }
        //---------------------------------------------------------------
        //Connexion au moteur Qlik 
        //---------------------------------------------------------------
        private void Connect()
        {
            try
            {
                if(ServerMode) ConnectToServer(); 
                //else ConnectToLocalHost(); dorenavant plus de connexion locale
            }
            catch (Exception)
            {
                throw;
            }
        }

        //---------------------------------------------------------------
        //Liste des application par stream disponibles pour l'utilisateur
        //---------------------------------------------------------------
        public void InitListeApplication(string desktopFolderApp)
        {
            try
            {
                
                // Si mode serveur( et non desktop)
                if (ServerMode)
                {
                    //dicionnaire ([id application]/[Objet issu JSON]) renvoyé par référence
                    _InfosApplicationParAppId.Clear();  

                    //Connexion rest en empruntant l'identité de l'utilisateur demandé
                    RestClient.AsNtlmUserViaProxy();

                    string reponseJson = RestClient.Get("/qrs/app/hublist/full");
                    SessionREST = RestClient._cookieJar.GetCookieHeader(RestClient.Uri);
                    
                    ////Test
                    //Location = ConnectServerTicketAttach.Connect(RestClient);

                    var settings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore,
                        MissingMemberHandling = MissingMemberHandling.Ignore

                    };
                    var listeHubInfo = JsonConvert.DeserializeObject<List<QRSHubListFullJson>>(reponseJson, settings);

                    //Pour chaque application (info du JSON), alimenter les 2 collections à renvoyées
                    foreach (QRSHubListFullJson HubInfo in listeHubInfo)
                    {
                        //Si l'application n'est pas dans un stream, ajoute info stream = Mon travail
                        if (HubInfo.stream == null || HubInfo.published == false)
                        {
                            //i++;
                            HubInfo.stream = new QRSHubListStreamJson();
                            HubInfo.stream.id = "Mon travail-OwnerId:" + HubInfo.owner.id;
                            HubInfo.stream.name = "Mon travail-" + HubInfo.owner.userId;
                            if (HubInfo.published == false) HubInfo.name = HubInfo.name + "-(NP)";
                        }
                        //Console.WriteLine(" Application = " + HubInfo.name + "-" + HubInfo.id);
                        //Console.WriteLine(" Stream = " + HubInfo.stream.name + "-" + HubInfo.stream.id
                        HubInfo.fileSize = Math.Round(float.Parse(HubInfo.fileSize) / 1024 / 1024, 3, MidpointRounding.AwayFromZero).ToString();
                        _InfosApplicationParAppId.Add(HubInfo.id, HubInfo);
                    }
                }
                // Si mode desktop => liste des application par SDK
                else InitListeApplicationDesktop(desktopFolderApp);

            }
            catch (Exception)
            {
                MessageErreur = "Erreur InitListeApplicationParStream.\n";
                throw;
            }
        }

        //---------------------------------------------------------------
        //Liste des application disponible sur le desktop de l'utilisateur 
        // (à partir de \\[Machine]\ImportApps)
        //---------------------------------------------------------------
        private void InitListeApplicationDesktop(string desktopFolderApp)
        {
            //Chemin à analyser
            String directory = @"\\"+ HostName + @"\" + desktopFolderApp + @"\";
            _InfosApplicationParAppId.Clear();
            List<FileAttributes> _fileName = GetFileOfDirectory(directory, ".qvf");

            foreach (var file in  _fileName)
            {
                QRSOwnerJson ownerInfo = new QRSOwnerJson();
                ownerInfo.userId = Environment.UserName;
                ownerInfo.name = Environment.UserName;

                QRSHubListFullJson HubInfo = new QRSHubListFullJson();
                HubInfo.id = file.fileInfo.FullName;
                HubInfo.name = file.fileInfo.Name;
                HubInfo.title = file.fileInfo.Name.Replace(file.fileInfo.Extension, "");
                HubInfo.published = false;

                HubInfo.stream = new QRSHubListStreamJson();
                HubInfo.stream.id = "Mon travail-OwnerId:" + Environment.UserName;
                HubInfo.stream.name = "Mon travail";

                HubInfo.owner = new QRSOwnerJson();
                HubInfo.owner.userId = Environment.UserName;
                HubInfo.owner.name = Environment.UserName;
                
                HubInfo.fileSize = file.SizeMo.ToString();
                HubInfo.createdDate = file.fileInfo.CreationTime.ToString();
                HubInfo.modifiedDate = file.fileInfo.LastWriteTime.ToString();
                HubInfo.modifiedByUserName = "N/A";

                _InfosApplicationParAppId.Add(HubInfo.id, HubInfo);
            }
        }

        //----------------------------------------------------------------------------------
        // Modifier le propriétaire ddes objets de l'application par celui de l'application 
        //----------------------------------------------------------------------------------        
        public bool QRSChangeObjectOwner(string AppId, QRSOwnerJson ownerApplicationSource, QRSOwnerJson ownerApplicationCible)
        {
            try
            {
                RestClient.AsNtlmUserViaProxy();
                //String reponseJson = restClient.Get("/qrs/app/"+ AppId);
                string getUri = "/qrs/app/object/full?filter=app.id+eq+" + AppId;// + "+and+objectType+eq+%27sheet%27";
                String reponseJson = RestClient.Get(getUri);
                //Console.WriteLine(reponseJson);

                var listeAppObjectSheet = JsonConvert.DeserializeObject<List<QRSAppObjectJson>>(reponseJson);

                //On remplace le propriétaire de chaque feuille par celui de l'application
                foreach (QRSAppObjectJson appObjectSheet in listeAppObjectSheet)
                {
                    if (appObjectSheet.owner.userId.Equals(ownerApplicationSource.userId))
                    {
                        string body = "{ " +
                                            //"\"owner\" : " + JsonConvert.SerializeObject(OldAppOwner) + "," +
                                            "\"owner\" : " + JsonConvert.SerializeObject(ownerApplicationCible) + "," +
                                            "\"modifiedDate\" : " + JsonConvert.SerializeObject(appObjectSheet.modifiedDate) +
                                       " }";
                        RestClient = new RestClient(Host, Domain, UserId, Password);
                        RestClient.AsNtlmUserViaProxy();
                        string putUri = "/qrs/app/object/" + appObjectSheet.id;
                        string modifiedAppJson = RestClient.Put(putUri, body);
                        //Console.WriteLine(modifiedAppJson);
                    }
                }
                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur QRSChangeObjectOwner.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Exporter le modèle d'une application  via le SDK
        //----------------------------------------------------------------------        
        public string CsvCreateExport(string selectedApplicationId, string exportDir)
        {
            try
            {
                
                //Export du modele
                ExportModeleApp csvAppModel = ExportModeleApplication(selectedApplicationId);
                //Conversion du modele en tableau de string
                List<string> _modeleLayout = ModeleToTableau(csvAppModel);
                ExistOrCreate(exportDir);
                //Ecriture du fichier
                string baseFileName = exportDir + csvAppModel.appName + "-" + DateTime.Now.ToString("yyyyMMddHHmmss");
                string suffixeFicher = ".csv";
                string fullFileName = baseFileName + suffixeFicher;
                WriteTabToFile(_modeleLayout, fullFileName);
                return fullFileName;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur csvCreateExport pour application : " + selectedApplicationId + ".\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Transforme le modèle en tableau à écrire
        //----------------------------------------------------------------------        
        public List<string> ModeleToTableau(ExportModeleApp exportAppModel)
        {
            try
            {
                MyAppStructure structureApp = exportAppModel.globalStructure;

                //Tableau final
                List<string> _modele = new List<string>();

                //Ecriture entête fichier
                string enTete = CsvPrepareData("Nom_Application");
                enTete += CsvPrepareData("ID_Application");
                enTete += CsvPrepareData("Position_Application");
                enTete += CsvPrepareData("Nb_Application");
                enTete += CsvPrepareData("Titre_Feuille");
                enTete += CsvPrepareData("ID_Feuille");
                enTete += CsvPrepareData("Type_Feuille");
                enTete += CsvPrepareData("Propriétaire_Feuille");
                enTete += CsvPrepareData("Position_Feuille");
                enTete += CsvPrepareData("Nb_Feuille");
                enTete += CsvPrepareData("Titre_Objet");
                enTete += CsvPrepareData("ID_Objet");
                enTete += CsvPrepareData("Position_Objet");
                enTete += CsvPrepareData("Nb_Objet");
                enTete += CsvPrepareData("Type_Objet");
                enTete += CsvPrepareData("InLayout_Objet");
                enTete += CsvPrepareData("Extension");
                enTete += CsvPrepareData("Dimensions");
                enTete += CsvPrepareData("Mesures");
                enTete += CsvPrepareData("HyperCube_Json");
                enTete += CsvPrepareData("Json");

                //Ajout de l'entete
                _modele.Add(enTete);

                //Infos feuilles
                foreach (ExportModeleSheet sheet in exportAppModel._sheet )
                {
                    IList<ExportModeleObject> _objet = new List<ExportModeleObject>();
                    //Infos objets
                    _objet = sheet._object;

                    foreach (ExportModeleObject objet in _objet)
                    {
                        //Ajout colonnes csv
                        string line = CsvPrepareData(exportAppModel.appName); //JLEP x3
                        line += CsvPrepareData(exportAppModel.appId);
                        line += CsvPrepareData(exportAppModel.appPosition.ToString());
                        line += CsvPrepareData(exportAppModel.appNbtotal.ToString());
                        line += CsvPrepareData(sheet.sheetTitle);
                        line += CsvPrepareData(sheet.sheetId);
                        line += CsvPrepareData(sheet.sheetType);
                        line += CsvPrepareData(sheet.sheetOwner.name);
                        line += CsvPrepareData(sheet.sheetPosition.ToString());
                        line += CsvPrepareData(exportAppModel.sheetNbtotal.ToString());
                        line += CsvPrepareData(objet.objectTitle);
                        line += CsvPrepareData(objet.objectId);
                        line += CsvPrepareData(objet.objectPosition.ToString());
                        line += CsvPrepareData(sheet.objectNbtotal.ToString());
                        line += CsvPrepareData(objet.objectType);
                        //En mode Full ajoute info si champ existe en Layout
                        if (!(objet.objectExistInLayout)) line += CsvPrepareData("Non"); else line += CsvPrepareData("Oui");
                        line += CsvPrepareData(objet.objectExtension);
                        line += CsvPrepareData(objet.dimensions);
                        line += CsvPrepareData(objet.mesures);
                        line += CsvPrepareData(JsonConvert.SerializeObject(objet.objectHyperCubeDef));
                        if (objet.json != null)
                        {
                            var tmp = JsonConvert.SerializeObject(objet.json.Layout);
                            line += CsvPrepareData(tmp);
                        }
                        else line += CsvPrepareData(" ");

                        //Ajout de la ligne
                        _modele.Add(line);
                    }
                    
                }

                return _modele;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur ModeleToTableau.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Lister les variables d'une application 
        //----------------------------------------------------------------------        
        public List<NxVariableListItem> ListAppVariable(string selectedApplicationId) 
        {
            List<NxVariableListItem> _variable= new List<NxVariableListItem>();
            try
            {
                Dictionary<int, MyAppDescription> _app = FindApp(selectedApplicationId);
                if (_app.ContainsKey(1))
                {
                    Application = _app[1].application;
                    IEnumerable<NxVariableListItem> _variableList = Application.GetVariableList().GetLayout().Get<VariableObjectViewList>("qVariableList").Items;
                    foreach (NxVariableListItem var in _variableList)
                    {
                        _variable.Add(var);
                    }
                }
                return _variable;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur lister les variable de l'application : " + selectedApplicationId + ".\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Renvoie l'application (Iapp) selon l'id
        //----------------------------------------------------------------------        
        private Dictionary<int,MyAppDescription> FindApp(string selectedApplicationId, bool noData = false)
        {
            try
            {       
                using (IHub hub = Location.Hub())
                {
                    Dictionary<int, MyAppDescription> _app = new Dictionary<int, MyAppDescription>();
                    MyAppDescription appDescription = new MyAppDescription();
                    appDescription.numero = 0;

                    String applicationIdBoucle = String.Empty;
                    int numApplication = 0;
                    
                    //Recherche l'application selectionnée
                    foreach (IAppIdentifier appIdentifier in Location.GetAppIdentifiers())
                    {
                        numApplication++;
                        applicationIdBoucle = appIdentifier.AppId;
                        if (applicationIdBoucle.Equals(selectedApplicationId))
                        {
                            //Ajout app
                            UpdateTimeOut(200);//Passe à 60 secondes
                            appDescription.application = Location.App(appIdentifier, null, null, noData);
                            UpdateTimeOut(30);//Rétablit à 30 secondes 
                            

                            //Ajout appIdentifier
                            appDescription.appIdentifier = appIdentifier;
                            //Ajout numero
                            appDescription.numero = numApplication;

                            //Ajout de la structure (pour export Json par exemple)
                            appDescription.structure = SerializeApp(appDescription);
                            appDescription.json = appDescription.application.GetAllInfos();

                        }
                    }
                    appDescription.nombreTotal = numApplication;
                    if (appDescription.numero > 0)  _app.Add(1, appDescription);
                    return _app;
                }
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur FindApp : " + selectedApplicationId + ".\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Supprimer les variables d'une application 
        //----------------------------------------------------------------------        
        public int SDKRemoveAppVariables(List<NxVariableListItem> _variables, string selectedApplicationId)
        {
            int nbVariableSupp = 0;
            bool etapeOk = false;
            string duplicatedApplicationName = String.Empty;

            try
            {
                //Si présence de variables à supprimer
                if (_variables.Count > 0)
                {
                    //Suppression des variables en passant par une dupplication puis remplacement
                    if (ServerMode) duplicatedApplicationName = selectedApplicationId + "_bis";
                    else duplicatedApplicationName = selectedApplicationId.Split('\\').Last().Replace(".qvf", "_bis.qvf");
                    //Renomage de l'application duppliquée pour le cas desktop 
                    duplicatedApplicationName = duplicatedApplicationName.Replace(".qvf_bis", "_bis.qvf");
                    string duplicatedAppId = CopyApplication(selectedApplicationId, duplicatedApplicationName);
                    //Vérifier que l'ID de l'application dupliqué est valide 
                    if (string.IsNullOrEmpty(duplicatedAppId)) throw new ArgumentException("Erreur SDKRemoveVariable.\n", "CopyApplication");
                    else
                    {
                        Dictionary<int, MyAppDescription> _app = FindApp(duplicatedAppId);
                        if (_app.ContainsKey(1))
                        {
                            IApp app;
                            using (app = _app[1].application)
                            {
                                    
                                //Suppression des variables dans l'application dupliquée
                                foreach (NxVariableListItem var in _variables)
                                {
                                    app.DestroyVariableById(var.Info.Id);
                                    nbVariableSupp++;
                                }

                                //Variable supprimées > 0 : sauvegarde de l'application + remplacement + suppression
                                if (nbVariableSupp > 0)
                                {
                                    //Sauvegarde application
                                    app.DoSave(selectedApplicationId);
                                    etapeOk = ReplaceApplication(selectedApplicationId, duplicatedAppId);
                                    if(ServerMode) QRSDeleteApplication(duplicatedAppId);
                                }
                            }
                        }
                    }
                }
                return nbVariableSupp;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur SDKRemoveVariable.\n";
                throw;
            }
        }

        public int SDKRemoveVariableWithCopyAndReplace(List<NxVariableListItem> _variables, string selectedApplicationId)
        {
            int nbVariableSupp = 0;
            bool etapeOk = false;
            string duplicatedApplicationName = String.Empty;
            //IApp app;
            try
            {
                //Si présence de variables à supprimer
                if(_variables.Count > 0)
                {
                    //Dupplication de l'application
                    if(ServerMode) duplicatedApplicationName = selectedApplicationId + "_bis";
                    else duplicatedApplicationName = selectedApplicationId.Split('\\').Last().Replace(".qvf", "_bis.qvf");
                    //Cas desktop 
                    duplicatedApplicationName = duplicatedApplicationName.Replace(".qvf_bis", "_bis.qvf");
                    string duplicatedAppId = CopyApplication(selectedApplicationId, duplicatedApplicationName);

                    if (string.IsNullOrEmpty(duplicatedAppId)) throw new ArgumentException("Erreur SDKRemoveVariable.\n", "CopyApplication");
                    else
                    {    
                        Dictionary<int, MyAppDescription> _app = FindApp(duplicatedAppId);
                        if (_app.ContainsKey(1))
                        {
                            IApp app;
                            using (app = _app[1].application)
                            {
                                string oldScript = app.GetScript();
                                app.SetScript("");
                                //Suppression des variables dans l'application dupliquée
                                foreach (NxVariableListItem var in _variables)
                                {
                                    app.DestroyVariableById(var.Info.Id);
                                    nbVariableSupp++;
                                }
                                
                                //Variable supprimées > 0 : sauvegarde de l'application + remplacement + suppression
                                if (nbVariableSupp > 0)
                                {
                                    app.SetScript(oldScript);
                                    //Sauvegarde application
                                    app.DoSave(selectedApplicationId);
                                    etapeOk = ReplaceApplication(selectedApplicationId, duplicatedAppId);
                                }
                            }
                        }
                    }
                }
                return nbVariableSupp;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur SDKRemoveVariable.\n";
                throw;
            }
        }
        
        //----------------------------------------------------------------------
        // Supprimer les variables d'une application 
        //----------------------------------------------------------------------        
        public string GetScriptDirectory(string ApplicationId, bool isFullPath=false)
        {
            string SVNAppDirectory = string.Empty;
            string scriptTxt = string.Empty;
            try
            {
                Dictionary<int, MyAppDescription> _app = FindApp(ApplicationId, true);
                if (_app.ContainsKey(1))
                {
                    SVNAppDirectory = _app[1].application.GetScript();

                    //Uniquement le répertoire parent du script demandé
                    if(SVNAppDirectory.Contains("/main.qvs');") && SVNAppDirectory.Contains("lib://$(vEnv)/applications/"))
                    {
                        string dirBase = "lib://$(vEnv)/applications/";
                        string dirFin = "/main.qvs');";
                        string[] debut = new string[] { dirBase };
                        string[] fin = new string[] { dirFin };
                        if (isFullPath)
                            SVNAppDirectory = dirBase + SVNAppDirectory.Split(debut, StringSplitOptions.None)[1].Split(fin, StringSplitOptions.None)[0] + dirFin.Replace("');", "");
                        else
                            SVNAppDirectory = SVNAppDirectory.Split(debut, StringSplitOptions.None)[1].Split(fin, StringSplitOptions.None)[0];
                    }
                }
                return SVNAppDirectory;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur GetScriptDirectory.\n";
                throw;
            }
        }

        //------------------------------------------------------------------------------
        // Lister les feuilles d'une application (cf propriété Application)
        //------------------------------------------------------------------------------      
        private String ListAppSheet()
        {
            try
            {
                int i = 0;
                String tmpSheetList = "";
                ISheetList sheetList = Application.GetSheetList();

                foreach (ISheetObjectViewListContainer sheet in sheetList.Items)
                {
                    i++;
                    tmpSheetList += "  SHEET : " + sheet.Info.Id;//SheetMetaData.Title;
                    tmpSheetList += " - (" + sheet.Data.Title + ")";
                    tmpSheetList += " - " + i + "/" + sheetList.Items.Count();
                    tmpSheetList += "\n";

                    tmpSheetList += ListSheetObject(sheet) + ";";
                }
                return tmpSheetList;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur lors de la création de la liste des feuilles.\n";
                throw;
            }
        }
        
        //----------------------------------------------------------------------
        // Exporter le modèle d'une application  via le SDK
        //----------------------------------------------------------------------        
        public ExportModeleApp ExportModeleApplication(string appId)
        {
            try
            {
                ExportModeleApp myApplication = new ExportModeleApp();
                using (IHub hub = Location.Hub())
                {
                    //Récupère les infos de l'application correspondant à selectedApplicationId
                    Dictionary<int, MyAppDescription> _app = FindApp(appId, true);
                    if (_app.ContainsKey(1))
                    {
                        //Info de l'applications
                        IAppIdentifier appIdentifier = _app[1].appIdentifier;
                        Application = _app[1].application;

                        //Récupère la liste des Feuilles
                        ISheetList sheetList = Application.GetSheetList();
                        
                        List<ExportModeleSheet> mySheetTab = new List<ExportModeleSheet>();
                        myApplication.appId = appId;
                        myApplication.appName = appIdentifier.AppName;
                        myApplication.appPosition = _app[1].numero;
                        myApplication.appNbtotal = _app[1].nombreTotal;
                        myApplication.sheetNbtotal = sheetList.Items.Count();
                        myApplication.globalStructure = _app[1].structure;

                        //Récupère propriété feuille
                        int sheetPosition = 0;
                        foreach (ISheetObjectViewListContainer sheet in sheetList.Items)
                        {
                            sheetPosition++;
                            ExportModeleSheet mySheet = new ExportModeleSheet();
                            List<ExportModeleObject> myobjectLayout = new List<ExportModeleObject>();
                            List<ExportModeleObject> myobjectFull = new List<ExportModeleObject>();
                            var tmpSheet = Application.GetSheet(sheet.Info.Id);
                        
                            mySheet.sheetId = sheet.Info.Id;
                            mySheet.sheetTitle = sheet.Data.Title;
                            mySheet.sheetPosition = sheetPosition;
                            mySheet.sheetOwner = sheet.Meta.Get<QRSOwnerJson>("owner");
                            if(sheet.Meta.Get<bool>("approved")) mySheet.sheetType = "Base";
                            else
                            {
                                if (sheet.Meta.Get<bool>("published")) mySheet.sheetType = "Communauté";
                                else mySheet.sheetType = "Mes feuilles";
                            }

                            //Objets de la feuille : Récupère propriété d'affichage (layout)
                            int objetPosition = 0;
                            foreach (var sheetObject in sheet.Data.Cells)
                            {
                                objetPosition++;
                                ExportModeleObject myObject = new ExportModeleObject();
                                myObject.objectId = sheetObject.Name;
                                myObject.objectType = sheetObject.Type;
                                myObject.objectTitle = "";
                                myObject.objectPosition = objetPosition;
                                myObject.objectExistInLayout = true;
                                //Ajoute l'objet full dans la feuille
                                myobjectLayout.Add(myObject);
                            }
                            mySheet._objectLayout = myobjectLayout;

                            //Objets de la feuille : Récupère propriété complète (full)
                            var fullSheet = tmpSheet.GetFullPropertyTree();
                            objetPosition = 0;

                            var listBox = tmpSheet.GetChildInfos().Select(childInfo => Application.GetObject<GenericObject>(childInfo.Id)).OfType<IListboxListObjectDef>();
                            foreach (var child in fullSheet.Children)
                            {
                            
                                objetPosition++;

                                var sheetChild = Application.GetObject<GenericObject>(child.Property.Info.Id);

                                ExportModeleObject myObject = new ExportModeleObject();
                            
                                //Ajout propriétés simples
                                myObject.objectId = child.Property.Info.Id;
                                myObject.objectType = child.Property.Info.Type;
                                myObject.settingJson = sheetChild.GetEffectiveProperties();
                                //TO do : si objet type map, filterpanel, swr.., +1 => récupérer au bon endroit
                                if (myObject.settingJson.Get<StringExpressionContainer>("title")!=null) myObject.objectTitle = myObject.settingJson.Get<StringExpressionContainer>("title").ToString();

                                //Ajout de l'objet complet 
                                if (sheetChild is IVisualizationBase) myObject.json = (IVisualizationBase)sheetChild;
                            
                                myObject.objectHyperCubeDef = myObject.settingJson.Get<HyperCubeDef>("qHyperCubeDef");

                                var extensionMeta = myObject.settingJson.Get<AbstractStructure>("extensionMeta");
                                if (extensionMeta != null)
                                {
                                    if(extensionMeta.Get<StringExpressionContainer>("name") != null)
                                        myObject.objectExtension += extensionMeta.Get<StringExpressionContainer>("name").ToString();
                                    if (extensionMeta.Get<String>("version") != null)
                                        myObject.objectExtension += " (" + extensionMeta.Get<String>("version") + ")";
                                }
                            
                                myObject.objectPosition = objetPosition;
                                myObject.objectExistInLayout = ObjectIsInLayout(mySheet, myObject.objectId);
                                myObject = ExportModeleApplicationAddInfos(myApplication.globalStructure, myObject);
                                myobjectFull.Add(myObject);

                            }
                            //Ajoute l'objet full dans la feuille
                            mySheet._object = myobjectFull;

                        
                            mySheet.objectNbtotal = fullSheet.Children.Count();
                            mySheetTab.Add(mySheet);

                        }
                        //Ajoute la feuille dans l'application
                        myApplication._sheet = mySheetTab;
                    }
                }
                return myApplication;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur l'export du modèle de l'application : " + appId + ".\n";
                throw;
            }
        }
        
        //----------------------------------------------------------------------
        // recherche si l'objet existe en affichage (erreur potentielle)
        //----------------------------------------------------------------------      
        private bool ObjectIsInLayout(ExportModeleSheet sheet, string objectId )
        {
            try
            {
                bool retour = false;
                
                foreach (var objet in sheet._objectLayout)
                {
                    if (objet.objectId == objectId)
                    {
                        retour = true;
                        break;
                    }
                }
                
                return retour;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur ObjectIsInLayout.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Lister les objets d'une feuille
        //----------------------------------------------------------------------      
        private String ListSheetObject(ISheetObjectViewListContainer sheet)
        {
            try
            {
                //sheetList = app.GetSheetList().Items.ToList();
                int i = 0;
                String tmpObjectList = "";
                foreach (var sheetObject in sheet.Data.Cells)
                {
                    i++;
                    tmpObjectList += "    SHEETOBJECT : " + sheetObject.Name;
                    tmpObjectList += " - (" + sheetObject.Type + ")";
                    //tmpObjectList += " - (" + sheet.Meta.Get<string>("title") + ")"; 
                    tmpObjectList += " - " + i + "/" + sheet.Data.Cells.Count();
                    tmpObjectList += "\n";

                }
                return tmpObjectList;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur lors de la création de la liste des objets de la feuille : " + sheet.Data.Title + "-" + sheet.Info.Id + ".\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Livraison : récupérer le répertoire d'import
        //----------------------------------------------------------------------
        public void InitImportDirectory(string destinationServer, string importFolder)
        {
            try
            {
                string qlikImportDirecotry="";
                if (ServerMode)
                {
                    //Récupère le répertoire d'import
                    RestClient.AsNtlmUserViaProxy();
                    qlikImportDirecotry = RestClient.Get("/qrs/app/importfolder");
                    qlikImportDirecotry = qlikImportDirecotry.Replace("\\\\", "\\");
                    qlikImportDirecotry = qlikImportDirecotry.Replace("\"", "");
                    ImportDirectory = qlikImportDirecotry + "\\";
                    /*
                    //Si le chemin d'import débute par un chemin réseau, on le garde (srv99bi - après migration April 2018)
                    if (qlikImportDirecotry.StartsWith("\\\\")) ImportDirectory = qlikImportDirecotry+"\\";
                    //Sinon on le transforme en utilisant le partage \\ImportApps (srv02bi - avant migration April 2018)
                    else ImportDirectory = @"\\" + qlikImportDirecotry.Replace("C:\\ProgramData\\Qlik\\Sense\\Apps", destinationServer + "\\")+ ConfigurationManager.AppSettings["ImportDirectory"] + "\\";*/
                }
                else
                {
                    //ImportDirectory = @"C:\Users\" + Environment.UserName + @"\Documents\Qlik\Sense\Apps";
                    //"C:\\Users\\jlepouliquen\\Documents\\Qlik\\Sense\\Apps\\1-Appli DEV.qvf"

                    string appId = _InfosApplicationParAppId.First().Value.id;
                    String[] _appLocation = appId .Split('\\');
                    string appFileName = _appLocation[_appLocation.Length - 1];
                    string appDirectory = appId.Replace(appFileName, "");
                    qlikImportDirecotry = appDirectory;
                    /*ImportDirectory = @"\\" + destinationServer + "\\" + ConfigurationManager.AppSettings["ImportDirectory"] + "\\";*/
                    ImportDirectory = @"\\" + destinationServer + "\\" + importFolder + "\\";
                }
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur la récupération du répertoire d'import.";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Importer une application 
        //----------------------------------------------------------------------
        public string QRSImportApplication(String applicationName)
        {
            try
            {
                string newAppId = "";
                //Import
                // /qrs/app/import?name={name}&keepdata={keepdata} (POST)
                RestClient.AsNtlmUserViaProxy();
                applicationName = applicationName.Replace(".qvf", "");
                string body = "\"" + applicationName + ".qvf\"";
                string importJson = RestClient.Post("/qrs/app/import?name=" + applicationName + "&keepdata=true", body);
                QRSAppCopyJson newAppJson = JsonConvert.DeserializeObject<QRSAppCopyJson>(importJson);
                newAppId = newAppJson.id;

                return newAppId;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur l'import de l'application : " + applicationName + ".\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Remplacer une application 
        //----------------------------------------------------------------------
        public bool ReplaceApplication(String replacedAppId, String newAppId)
        {
           
            //Mode serveur => Via API, remplacement de l'application
            //if (ServerMode) if(QRSReplaceApplication(replacedAppId, newAppId)) QRSDeleteApplication(newAppId);
            if (ServerMode) QRSReplaceApplication(replacedAppId, newAppId);

            //Mode local => Via Copier + dosave() , remplacement de l'application
            else
            {
                //Application source : Récupère chemin + nom de fichier
                String[] _sourceFileName = newAppId.Split('\\');
                string sourceFileName = _sourceFileName[_sourceFileName.Length - 1];
                string sourceDirectory = newAppId.Replace(sourceFileName, "");

                //Application cible : Récupère chemin + nom de fichier
                String[] _targetFileName = replacedAppId.Split('\\');
                string targetFileName = _targetFileName[_targetFileName.Length - 1];
                string targetDirectory = replacedAppId.Replace(targetFileName, "");

                //Constitution chemin(=ID en desktop) du chemin local complet application cible
                string SourceFileId = targetDirectory + sourceFileName;
                try
                {
                        if (File.Exists(SourceFileId))
                    {

                        //Suppression du QVD cible
                        string targetFile = CopyFile(sourceDirectory, sourceFileName, targetDirectory, targetFileName);
                        //DeleteQvfFile(targetDirectory + targetFileName);

                        /* Avec la version serveur, ne plus utiliser le moteur du desktop
                         * 
                        //Si application > 1Go, import sans données
                        bool withData = true;
                        if (GetFileInfos(SourceFileId).SizeMo > 1000) withData = false;
                        //Ouverture de l'application et enregistrement sous le nom du fichier cible
                        //using (IApp app = Location.App(Location.AppWithId(targetDirectory + targetFileName), noData: !withData))
                        
                        UpdateTimeOut(200);
                        using (IApp app = Location.App(Location.AppWithId(SourceFileId), noData: !withData))
                        {
                            //Titre application = celui QVS d'origine    
                            NxAppProperties appProperties = app.GetAppProperties();
                            appProperties.Title = replacedAppId.Split('\\').Last().Replace(".qvf", "");
                            app.SetAppProperties(appProperties);
                            app.DoSave(targetDirectory + targetFileName);
                        }
                        UpdateTimeOut(30);
                        */
                        //Suppression du QVD source
                        DeleteQvfFile(sourceDirectory + sourceFileName);
                    }

                }
                catch (Exception e)
                {
                    MessageErreur = "Erreur sur le remplacement de l'application : " + replacedAppId + " par " + newAppId + ".\n";
                    if (e.Message.ToUpper().Contains("SECTION ACCESS"))
                    {
                        MessageErreur = "Une réduction de données ayant été détectée dans l'application d'origine, la livraison sur le desktop doit être effectuée sans les données (décocher CB \"Livrer données + variables\").\n";
                    }
                    DeleteQvfFile(sourceDirectory + sourceFileName);
                    throw;
                }
            }
            return true;
        }
        //----------------------------------------------------------------------
        // Remplacer une application via QRS
        //----------------------------------------------------------------------
        public bool QRSReplaceApplication(String replacedAppId, String newAppId)
        {
            try
            {
                // /qrs/app/{id}/replace?app={appid} (PUT)
                RestClient.AsNtlmUserViaProxy();

                string replaceAppJson = RestClient.Put("/qrs/app/" + newAppId + "/replace?app=" + replacedAppId, "");
                QRSAppCopyJson newAppJson = JsonConvert.DeserializeObject<QRSAppCopyJson>(replaceAppJson);

                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur le remplacement de l'application : " + replacedAppId + " par " + newAppId + ".\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Publier une application via QRS
        //----------------------------------------------------------------------
        public bool QRSPublishApplication(string appIdFrom, string streamIdTo, string appNameTo)
        {
            try
            {
                // /qrs/app/{id}/publish?stream={streamid}&name={name} (PUT)
                RestClient.AsNtlmUserViaProxy();

                string replaceAppJson = RestClient.Put("/qrs/app/" + appIdFrom + "/publish?stream=" + streamIdTo + "&name = " + appNameTo, "");
                QRSAppCopyJson newAppJson = JsonConvert.DeserializeObject<QRSAppCopyJson>(replaceAppJson);

                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur la plublication de l'application : " + appIdFrom + " sur " + appNameTo + ".\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Changer le propriétaire d'une application via QRS
        //----------------------------------------------------------------------
        public bool QRSChangeAppOwner(string appId)
        {
            try
            {


                //QRSOwnerJson / QRSHubListFullJson
                //string uri = "/qrs/app/" + appId;

                //Propriétaire d'origine
                RestClient.AsNtlmUserViaProxy();
                string uri = "/qrs/app/" + appId;
                String reponseJson = RestClient.Get(uri);
                var appInfo = JsonConvert.DeserializeObject<QRSHubListFullJson>(reponseJson);

                //Changement proprio en biadm pour faire un changement de valeur

                //Récupération user biadm
                QRSOwnerJson biadm = new QRSOwnerJson();
                List<QRSUser> _listUser = QRSGetUser();
                foreach (QRSUser user in _listUser)
                {
                    if (user.inactive == false && user.userId.Equals("biadm"))
                    {
                        biadm.id = user.id;
                        biadm.userId = user.userId;
                        biadm.name = user.userName;
                        biadm.userDirectory = user.userDirectory;
                        biadm.privileges = user.privileges;
                        break;
                    }
                }
                
                string body = "{ " +
                                    "\"owner\" : " + JsonConvert.SerializeObject(biadm) + "," +
                                    "\"modifiedDate\" : " + JsonConvert.SerializeObject(appInfo.modifiedDate) +
                                " }";
                RestClient = new RestClient(Host, Domain, UserId, Password);
                RestClient.AsNtlmUserViaProxy();
                //MAJ user
                string modifiedAppJson = RestClient.Put(uri, body);
                //Récup en particulier de la date de modif (nécessaire pour put suivant)
                QRSHubListFullJson modifiedApp = JsonConvert.DeserializeObject<QRSHubListFullJson>(modifiedAppJson);

                //Changement proprio en utilisateur d'origine
                body = "{ " +
                                    "\"owner\" : " + JsonConvert.SerializeObject(appInfo.owner) + "," +
                                    "\"modifiedDate\" : " + JsonConvert.SerializeObject(modifiedApp.modifiedDate) +
                                " }";
                RestClient = new RestClient(Host, Domain, UserId, Password);
                RestClient.AsNtlmUserViaProxy();
                modifiedAppJson = RestClient.Put(uri, body);

                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur sur QRSChangeAppOwner.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Archiver une application 
        //----------------------------------------------------------------------
        public string ArchivageApplication(string selectedApplicationId, String qvfDirectory, Boolean withData = false, int nbJourRetention = 7, string suffixeArchiveDir = null)
        {
            MessageErreur = string.Empty;
            string selectedApplicationName = _InfosApplicationParAppId[selectedApplicationId].name;

            try
            {
                if (!selectedApplicationName.Contains("&"))
                {
                    //using (IHub hub = Location.Hub())
                    //{
                        ////Récupère les infos de l'application correspondant à selectedApplicationId
                        //Dictionary<int,MyAppDescription> _app = FindApp(selectedApplicationId);
                        //if (_app.ContainsKey(1))
                        //{
                        //    IAppIdentifier appIdentifier = _app[1].appIdentifier;

                            //Duppliquer application (dans Mon travail) avec Nom+Date du jour
                            String dateArchivage = DateTime.Now.ToString("yyyyMMddHHmmss");

                            //Si création d'un répertoire à date du jour pour archivage (en général on est pas dans le cadre d'une livraison)
                            if (!String.IsNullOrEmpty(suffixeArchiveDir))
                            {
                                //Supprime les répertoire d'archivage présent dans rep qvfDirectory plus vieux de n jours
                                EpurationDirectory(qvfDirectory, suffixeArchiveDir, nbJourRetention);    
                                //Création d'un repertoire si nécessaire nommé avec la date du jour
                                qvfDirectory += DateTime.Now.ToString("yyyyMMdd") + suffixeArchiveDir + "\\";
                                ExistOrCreate(qvfDirectory);
                            }

                            //Nom de l'application exportée
                            String duplicatedApplicationName = "";
                            //if (ServerMode) duplicatedApplicationName = appIdentifier.AppName + "-" + dateArchivage + ".qvf";
                            //else duplicatedApplicationName = appIdentifier.AppName.Replace(".qvf", "") + "-" + dateArchivage 

                            if (ServerMode) duplicatedApplicationName = selectedApplicationName + "-" + dateArchivage + ".qvf";
                            else duplicatedApplicationName = selectedApplicationName.Replace(".qvf", "") + "-" + dateArchivage + ".qvf";

                            //Exporter application dans le répertoire strFilename
                            if (ExportApplication(duplicatedApplicationName, selectedApplicationId, qvfDirectory, withData) == true)
                            {
                                EpurationQvfDirectory(qvfDirectory, selectedApplicationName, dateArchivage);
                                return duplicatedApplicationName;
                            }

                            /*
                            //duplicatedApplicationName = duplicatedApplicationName.Replace("&", "%26amp;");
                            string duplicatedApplicationId = CopyApplication(selectedApplicationId, duplicatedApplicationName);
                            if (!duplicatedApplicationId.Equals(""))
                            {
                                //Ouvre l'application si nécessaire : archivage demandée sans les données/variables ou avec les données mais appli trop lourde
                                etapeOK = SDKOpenAndSaveApplication(duplicatedApplicationId, withData);
                                //Ouvrir application sans données et enregister
                                if (etapeOK == true)
                                {
                                    //Exporter application dans le répertoire strFilename
                                    if (ExportApplication(duplicatedApplicationName, duplicatedApplicationId, qvfDirectory) == true)
                                    {
                                        //Supprimer application de Mon travail
                                        if (QRSDeleteApplication(duplicatedApplicationId) == true)
                                        {
                                            EpurationQvfDirectory(qvfDirectory, appIdentifier.AppName, dateArchivage);
                                            //Archivage réussi
                                            return duplicatedApplicationName;
                                        }
                                    }
                                }
                            }*/
                        //}
                    //}
                }
                //L'archivage n'a pas été au bout
                return "";
            }
            catch (Exception)
            {
                MessageErreur += "\nErreur sur l'archivage de l'application : " + selectedApplicationName + ".\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Epuration des QVF archivés dans le répertoire  
        //----------------------------------------------------------------------
        public void EpurationQvfDirectory(string qvfDirectory, string qvfName, string archivageDate)
        {
            try
            {
                if (System.IO.Directory.Exists(qvfDirectory))
                {
                    string[] files = System.IO.Directory.GetFiles(qvfDirectory);
                    //Parcours des fichiers du répertoire qvfDirectorie
                    foreach (string s in files)
                    {
                        qvfName = qvfName.Replace(".qvf", "");
                        string sFileNameSansExtension = System.IO.Path.GetFileNameWithoutExtension(s);
                        string sFileNameAvecExtension = System.IO.Path.GetFileName(s);
                        string sFileExtension = System.IO.Path.GetExtension(s);
                        //Pour les noms de fichier contenant le nom de l'application
                        if (sFileNameSansExtension.StartsWith(qvfName + "-") && sFileExtension.ToUpper().Equals(".QVF"))
                        {
                            string sFileDate = sFileNameSansExtension.Replace(qvfName + "-", "");
                            //Si la date d'archivage est < à la dernière archive
                            if (Int64.Parse(sFileDate) < Int64.Parse(archivageDate)) System.IO.File.Delete(s);
                        }
                    }
                }
            }
            catch (Exception)
            {
                MessageErreur += "Erreur EpurationQvfDirectory.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Methode pour sauvegarder une application (avec ou sans données)
        //----------------------------------------------------------------------
        public bool SDKOpenAndSaveApplication(string appId, bool withData)
        {
            IApp app;
            try
            {
                //Ouverture sans données  demandée
                if (!withData)
                {
                    UpdateTimeOut(200);//Passe le timeout à 200 secondes (si delai supérieur => exception)
                    //System.Windows.Forms.MessageBox.Show("4- Session = " + Location.SessionCookie);

                    //Ouverture appli
                    using (app = Location.App(Location.AppWithId(appId), noData: !withData))
                    {
                        //Sauvegarde de l'application
                        app.DoSave();
                    }

                    //Suppression des variables de l'application 
                    List<NxVariableListItem> _variable = ListAppVariable(appId);
                    int nbDeletedVariable = 0;
                    if (_variable.Count > 0) nbDeletedVariable = SDKRemoveAppVariables(_variable, appId);

                    UpdateTimeOut(30);//Rétablit le timeout à 30 secondes
                    //Si save sans données : suppression des variables
                }

                return true;
            }
            catch (TimeoutException ex)
            {
                MessageErreur += "Application trop lourde. Sauvegardée sans données, elle sera à recharger." + ex.Message + ".\n";
                using (app = Location.App(Location.AppWithId(appId), noData: true))
                {
                    app.DoSave();
                }
                return true;
            }
            catch (Exception)
            {
                MessageErreur += "Erreur SDKOpenAndSaveApplication.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Copier une application (user devient owner)
        //----------------------------------------------------------------------
        public string CopyApplication(string strAppID, string strAppNewName)
        {
            try
            {
                string newAppId = "";
             
                if (ServerMode) newAppId = QRSMakeCopyApplication(strAppID, strAppNewName);
                else
                {
                    String[] _sourceFileName = strAppID.Split('\\');
                    string sourceFileName = _sourceFileName[_sourceFileName.Length-1];
                    string sourceDirectory = strAppID.Replace(sourceFileName, "");       
                    string targetDirectory = sourceDirectory;
                    string targetFileName = strAppNewName;
                    newAppId = CopyFile(sourceDirectory, sourceFileName, targetDirectory, targetFileName);
                }
                return newAppId;
            }
            catch (Exception)
            {
                MessageErreur += "Erreur CopyApplication.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Copier une application (user devient owner)
        //----------------------------------------------------------------------
        public string QRSMakeCopyApplication(string strAppID, string strAppNewName)
        {
            try
            {
                ///qrs/app/{id}/copy?name={name} (POST)
                RestClient.AsNtlmUserViaProxy();
                //RestClient.AsDirectConnection(false, 4242, true, null);

                string makeCopyJson = RestClient.Post("/qrs/app/" + strAppID + "/copy?name=" + strAppNewName, "");
                QRSAppCopyJson newAppJson = JsonConvert.DeserializeObject<QRSAppCopyJson>(makeCopyJson);
                string newAppId = "";
                newAppId = newAppJson.id;

                return newAppId;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QRSMakeCopyApplication.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Supprimer une application
        //----------------------------------------------------------------------
        public bool QRSDeleteApplication(string AppID)
        {
            try
            {
                if(ServerMode)
                {
                    ///qrs/[type]/{id} (DELETE)
                    RestClient.AsNtlmUserViaProxy();
                    string makeCopyJson = RestClient.Delete("/qrs/app/" + AppID);
                }
                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QRSDeleteApplication.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Supprimer un objet d'une application UTILE??? CAR QUE SHEET ET STORY???
        //----------------------------------------------------------------------
        public bool QRSDeleteObject(string AppID, string ObjectID)
        {
            try
            {
                if (ServerMode)
                {
                    ///qrs/[type]/{id} (DELETE)
                    RestClient.AsNtlmUserViaProxy();
                    string makeCopyJson = RestClient.Delete("/qrs/app/object/" + ObjectID);
                }
                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QRSDeleteObject.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Exporter une application en local
        //----------------------------------------------------------------------
        public bool ExportApplication(string strAppName, string strAppID, string QvfDirectory, bool withData)
        {
            try
            {
                bool retour = false;
                if (ServerMode) retour = QRSExportApplication(strAppName, strAppID, QvfDirectory, withData);
                else
                {
                    String[] _sourceFileName = strAppID.Split('\\');
                    string sourceFileName = _sourceFileName[_sourceFileName.Length - 1];
                    string sourceDirectory = strAppID.Replace(sourceFileName, "");
                    string targetDirectory = QvfDirectory;
                    string targetFileName = strAppName;
                    //Si on ne livre pas du localhost au localhost, on déplace le fichier vers le serveur à livrer
                    if (sourceDirectory != targetDirectory)
                    {
                        string targetFile = MoveQVF(sourceDirectory, sourceFileName, targetDirectory, targetFileName);
                        if (!String.IsNullOrEmpty(targetFile)) retour = true;
                    }
                    else retour = true;

                }
                return retour;
            }
            catch (Exception)
            {
                MessageErreur += "Erreur ExportApplication.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Export application : récupère la stream via un objet HttpClient
        //----------------------------------------------------------------------
        public Stream GetStreamByHttpClient(string uri, string complementUrl)
        {
            uri = uri.Replace("http", "https");
            string fullUrl = uri + complementUrl; 
            HttpClientHandler handler = new HttpClientHandler();
            handler.ClientCertificates.Add(GetCertificate(Host)[0]);
            HttpClient client = new HttpClient(handler);

            //client.BaseAddress = new Uri(fullUrl.Split(':')[1].Split('/')[1] + '/' );
            client.BaseAddress = new Uri(uri);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.qlik.sense.app"));
            client.DefaultRequestHeaders.Add("X-Qlik-xrfkey", Xrfkey);
            client.DefaultRequestHeaders.Add("X-Qlik-User", string.Format("UserDirectory={0};UserId={1}", Domain, UserId));
            return Task.Run(async () => await client.GetStreamAsync(fullUrl)).Result;

        }

        //----------------------------------------------------------------------
        // Export application : récupère la stream via un objet HttpClient
        //----------------------------------------------------------------------
        public HttpWebResponse GetResponseByHttpWebRequest(string uri, string complementUrl)
        {
            //uri = uri.Replace("http", "https");
            string fullUrl = uri + complementUrl;
            Uri myUri = new Uri(fullUrl);
            HttpWebRequest requestGet = (HttpWebRequest)WebRequest.Create(myUri);
            //HttpWebRequest requestGet = (HttpWebRequest)WebRequest.Create(@"" + Host + strDownloadPath + "&xrfkey=" + Xrfkey);
            var userHeaderValue = string.Format("UserDirectory={0};UserId={1}", Domain, UserId);

            requestGet.Method = "GET";
            requestGet.Accept = "application/vnd.qlik.sense.app";
            requestGet.Headers.Add("X-Qlik-xrfkey", Xrfkey);
            requestGet.Headers.Add("X-Qlik-User", userHeaderValue);
            requestGet.UserAgent = "Windows";
            //requestGet.ContentType = "attachment;filename*=utf-8''" + strDownloadPath.Split('/')[3].Split('?')[0] ;

            requestGet.UseDefaultCredentials = true;
            return (HttpWebResponse)requestGet.GetResponse();
            /*using (var response = (HttpWebResponse)requestGet.GetResponse()) {
                return response.GetResponseStream();
            }*/
        }

        //----------------------------------------------------------------------
        // Exporter une application 
        //----------------------------------------------------------------------
        public bool QRSExportApplication(string strAppName, string strAppID, string QvfDirectory, bool withdata = false)
        {
            try
            {

                //JLEP Pour test : cible Publicité site
                //if (strAppID != "2eddb761-e201-4d08-8e4b-9ad7c9858f9c") return true;
                //STEP 1 : Obtention d'un ticket de téléchargement (GUID) via "/qrs/app/{id}/export/{token}"
                RestClient.AsNtlmUserViaProxy();
                //string exportStep1Json = RestClient.Post("/qrs/app/" + strAppID + "/export/060dcbca-4782-4f99-a7c4-767190e85355", "");
                Guid uuid = Guid.NewGuid();
                string skipData = "";
                if (withdata) skipData = "false";
                else skipData = "true";
                string exportEndpoint = "/qrs/app/" + strAppID + "/export/" + uuid.ToString() + "?skipdata=" + skipData;
                string exportStep1Json = RestClient.Post(exportEndpoint, "");
                QRSAppExportStep1 exportStep1 = JsonConvert.DeserializeObject<QRSAppExportStep1>(exportStep1Json);

                string strDownloadPath = exportStep1.downloadPath;

                //STEP 2 : Téléchargement de l'application en utilisant le ticket STEP 1 via "/qrs/download/app/{appId}/{exportTicketId}/{fileName}"
                //Si ticket de telechargement retourné
                if (!String.IsNullOrEmpty(strDownloadPath))
                {
                    //Archivage des session pour suppression session du STEP 2
                    List<string> ListSessionsUserAvant = ListSessionsUser(Domain, UserId);
                    
                    //Envoi de la requête avec emprunt d'identité au préalable (fait directement dans la classe RestClient pour les autres appels à l'api)
                    if (!Impersonation.impersonateValidUser(UserId, Domain, Password)) throw new ArgumentException("L'utilisateur indiqué n'est pas valide.\n Vérifier user/mdp.\n", "Utilisateur - mot de passe");
                    else
                    {

                        //Ligne suivante à décommenter pour mode HttpWebResponse
                        /*using (HttpWebResponse response = GetResponseByHttpWebRequest(Host, strDownloadPath + "&xrfkey=" + Xrfkey)) {                            
                            using (Stream stream = response.GetResponseStream()) { */
                            using (Stream stream = GetStreamByHttpClient(Host + ":4242", strDownloadPath + "&xrfkey=" + Xrfkey)){
                            
                                 // Create the local file  
                                 Stream localStream = File.Create(QvfDirectory + strAppName);
                                 int bytesProcessed = 0;
                                 // Allocate a 1k buffer  
                                 byte[] buffer = new byte[1024];
                                 int bytesRead;
                                // Simple do/while loop to read from stream until  
                                do
                                {
                                    // Read data (up to 1k) from the stream  
                                    bytesRead = stream.Read(buffer, 0, buffer.Length);
                                    // Write the data to the local file  
                                    localStream.Write(buffer, 0, bytesRead);
                                    // Increment total bytes processed  
                                    bytesProcessed += bytesRead;
                                } while (bytesRead > 0);                     

                                localStream.Close();

                            }
                            //Archivage des nouvelles session pour suppression session step2
                            List<string> ListSessionsUserApres = ListSessionsUser(Domain, UserId);
                            //Suppresion des nouvelles sessions
                            DeleteSessionsDiff(ListSessionsUserApres, ListSessionsUserAvant);
                        //Ligne suivante à décommenter pour mode HttpWebResponse
                        //}
                        //Suppression de l'emprunt d'identité
                        Impersonation.undoImpersonation();
                    }
                }
                return true;
                
            }
            catch (UnauthorizedAccessException)
            {
                MessageErreur = "Erreur QRSExportApplication.\nVérifier partage et droit(écriture) du répertoire : " + QvfDirectory + "\n";
                throw;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QRSExportApplication.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Retourner l'état d'une application
        //----------------------------------------------------------------------
        public void QRSApplicationState(String strAppID)
        {
            try
            {
                // "/qrs/app/{id}/state"
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"" + Host + "/QRS/app/" + strAppID + "/state?xrfkey=" + Xrfkey);
                request.Method = "GET";
                request.UserAgent = "Windows";
                request.Accept = "application/json";
                request.Headers.Add("X-Qlik-xrfkey", Xrfkey);
                request.UseDefaultCredentials = true;

                // make the web request and return the content
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream stream = response.GetResponseStream();
                //Console.WriteLine(new StreamReader(stream).ReadToEnd());
            }
            catch (Exception)
            {
                Console.WriteLine("Erreur QRSApplicationState.\n");
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Retourner un ticket
        //----------------------------------------------------------------------
        public String QRSArchivageGetTicket(String strAppID)
        {
            try
            {

                //Create the HTTP Request and add required headers and content in xrfkey
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"" + Host + "/QRS/app/" + strAppID + "/export?xrfkey=" + Xrfkey);

                request.Method = "GET";
                request.UserAgent = "Windows";
                request.Accept = "application/json";
                request.Headers.Add("X-Qlik-xrfkey", Xrfkey);
                request.UseDefaultCredentials = true;

                // make the web request and return the content
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream stream = response.GetResponseStream();
                String ticketJson = new StreamReader(stream).ReadToEnd();

                QRSMyTicket ticket = JsonConvert.DeserializeObject<QRSMyTicket>(ticketJson);
                string ticketID = ticket.value;
                return ticketID;
            }
            catch (Exception)
            {
                Console.WriteLine("Erreur QRSArchivageGetTicket.\n");
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Retourner des infos sur le repository
        //----------------------------------------------------------------------
        public void QRSQrsAbout(string[] args)
        {
            RestClient.AsNtlmUserViaProxy();
            Console.WriteLine(RestClient.Get("/qrs/about"));
        }
        //----------------------------------------------------------------------
        // Initier une connexion au repository
        //----------------------------------------------------------------------
        public void QRSConnectQSR()
        {
            try
            {
                //Create the HTTP Request and add required headers and content in xrfkey
                string xrfkey = "0123456789abcdef";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"" + Host + "/QRS/app?xrfkey=" + xrfkey);
                request.Method = "GET";
                request.UserAgent = "Windows";
                request.Accept = "application/json";
                request.Headers.Add("X-Qlik-xrfkey", xrfkey);
                // specify to run as the current Microsoft Windows user
                request.UseDefaultCredentials = true;
                // make the web request and return the content
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream stream = response.GetResponseStream();
                //Console.WriteLine(new StreamReader(stream).ReadToEnd());
            }
            catch (Exception)
            {
                Console.WriteLine("Erreur QRSConnectQSR.\n");
                throw;
            }
        }
        //----------------------------------------------------------------------
        // Retourner les utilisateur connectés
        //----------------------------------------------------------------------
        public Dictionary<string, string> QEngineHealthInfo()
        {
            try
            {
                RestClient.AsNtlmUserViaProxy();
                string reponseJson = RestClient.Get("/engine/healthcheck/");
                //Console.WriteLine(reponseJson);
                QEngineHealth engineHealthInfo = JsonConvert.DeserializeObject<QEngineHealth>(reponseJson);

                Dictionary<string, string> _detailsHealth = new Dictionary<string, string>();
                _detailsHealth.Add("started", engineHealthInfo.started);
                _detailsHealth.Add("totalSession", engineHealthInfo.session.total);
                _detailsHealth.Add("activeSession", engineHealthInfo.session.active);
                _detailsHealth.Add("totalUser", engineHealthInfo.users.total);
                _detailsHealth.Add("activeUser", engineHealthInfo.users.active);
                return _detailsHealth;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QEngineHealthInfo.\n" ;
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Retourner les utilisateur connectés
        //----------------------------------------------------------------------
        public Dictionary<string, string> QPSConnectedUser()
        {
            try
            {
                int totalSession = 0;
                int totalUtilisateur = 0;
                string details = "";

                //Liste des utilisateur
                List<QRSUser> _listUser = QRSGetUser();
                foreach (QRSUser user in _listUser)
                {
                    if (user.inactive == false)
                    {
                        //Pour chaque utilisateur actif, ramène ses sessions
                        int nbSessionUser;
                        List<QPSSessionUser> listSessionUser = QPSSessionsParUser(user.userDirectory, user.userId);
                        nbSessionUser = listSessionUser.Count;
                        if(nbSessionUser > 0)
                        {
                            totalUtilisateur++;
                            details += "    > Session utilisateur " + user.userDirectory + "/" + user.userId + " (" + nbSessionUser + ") :\n";

                            foreach (QPSSessionUser sessionUser in listSessionUser)
                            {
                                details += "        > " + sessionUser.SessionId + "\n"; ;
                                totalSession++;
                            }
                        }

                    }                    
                }

                Dictionary<string, string> _detailsConnexion = new Dictionary<string, string>();
                _detailsConnexion.Add("totalSession", totalSession.ToString());
                _detailsConnexion.Add("totalUtilisateur", totalUtilisateur.ToString());
                _detailsConnexion.Add("details", details);

                return _detailsConnexion;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QPSConnectedUser.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Retourner les sessions de l'utilisateur
        //----------------------------------------------------------------------
        public List<QPSSessionUser>  QPSSessionsParUser(string domain, string userId)
        {
            try
            {
                RestClient.AsDirectConnection(true);
                string reponseJson = RestClient.Get("/qps/user/" + domain + "/" + userId);
                return JsonConvert.DeserializeObject<List<QPSSessionUser>>(reponseJson);
            }
            catch (Exception e)
            {
                Console.WriteLine("Erreur QPSSessionsParUser : \n" + e.Message);
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Retourner les sessions de l'utilisateur
        //----------------------------------------------------------------------
        public List<string> ListSessionsUser(string domain, string userId)
        {
            try
            {
                List<string> _listSession = new List<string>();

                List<QPSSessionUser> listSessionUser = QPSSessionsParUser(domain, userId);
                foreach (QPSSessionUser sessionUser in listSessionUser)
                {
                    _listSession.Add(sessionUser.SessionId);
                }
                
                return _listSession;
            }
            catch (Exception)
            {
                Console.WriteLine("Erreur ListSessionsUser.\n");
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Supprime les sessions de "_session" non présent dans "_sessionRef"
        //----------------------------------------------------------------------
        public void DeleteSessionsDiff(List<string> _sessionRef,List<string> _session)
        {
            try
            {
                foreach (string sessionId in _session)
                {
                    if (!_sessionRef.Contains(sessionId))
                    {
                        QPSDeleteSession(sessionId);
                    }
                }
            }
            catch (Exception)
            {
                Console.WriteLine("Erreur ListSessionsUser.\n");
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Supprime une session 
        //----------------------------------------------------------------------
        public void QPSDeleteSession(string sessionId = null)
        {
            string reponseJson = "";
            try
            {
                //si pas de sessionId en paramètre supprime la session de la connexion courante
                if (sessionId == null)
                {
                    string sdkSessionId = "";
                    string restSessionId = "";

                    //Session SDK
                    if (Location != null && Location.SessionCookie != null) sdkSessionId = Location.SessionCookie.Replace("X-Qlik-Session=", "");                    
                    if (!string.IsNullOrEmpty(sdkSessionId))
                    {
                        RestClient.AsDirectConnection(true);
                        reponseJson = RestClient.Delete("/qps/session/" + sdkSessionId);
                    }

                    //Session REST
                    if (RestClient != null && RestClient._cookieJar != null) restSessionId = RestClient._cookieJar.GetCookieHeader(RestClient.Uri).Replace("X-Qlik-Session=", "");
                    if (!string.IsNullOrEmpty(restSessionId))
                    {
                        RestClient.AsDirectConnection(true);
                        reponseJson = RestClient.Delete("/qps/session/" + restSessionId);
                    }
                }
                //Suppression d'une session passée en paramètre
                else
                {
                    RestClient.AsDirectConnection(true);
                    reponseJson = RestClient.Delete("/qps/session/" + sessionId);
                }

            }
            catch (Exception)
            {
                MessageErreur = "Erreur QPSDeleteSession.\n";
                //throw;
            }
        }
        //----------------------------------------------------------------------
        // Retourner la liste des utilisateurs 
        //----------------------------------------------------------------------
        public List<QRSUser> QRSGetUser()
        {
            try
            {
                RestClient.AsNtlmUserViaProxy();
                string reponseJson = RestClient.Get("/qrs/user/full");
                return JsonConvert.DeserializeObject<List<QRSUser>>(reponseJson);
            }
            catch (Exception)
            {
                MessageErreur = "Erreur QRSGetUser.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Test si la connecion de l'objet est toujours opérationnelle
        //----------------------------------------------------------------------
        public bool ConnexionIsActive()
        {
            try
            {
                IHub hub = Location.Hub();
                return true;
            }
            catch
            {
                return false;
            }
        }
        //----------------------------------------------------------------------
        // Supprimer un ou plusieurs objets de l'application 
        //----------------------------------------------------------------------        
        public List<string> SDKRemoveAppObjects(List<string> _objets, string selectedApplicationId)
        {         
            List<string> _deletedObjets = new List<string>();
            string duplicatedApplicationName = String.Empty;

            try
            {
                //Si présence d'objets à supprimer
                if (_objets.Count > 0)
                {
                    /////*NE SERT A RIEN POUR L'INSTANT CAR ON NE SAIT PAS DISTINGUER LES FEUILLES DE BASE*/
            ////Vérifier qu'au moins un objet présent dans les feuilles de base
            //int nbObjetASupp = 0;
            //Dictionary<int, MyAppDescription> _selectedApp = FindApp(selectedApplicationId);
            //if (_selectedApp.ContainsKey(1))
            //{
            //    IApp app;
            //    using (app = _selectedApp[1].application)
            //    {
            //        foreach (var objet in _objets)
            //        {
            //            string feuilleId = objet.Split('/')[0];
            //            string objetId = objet.Split('/')[1];
            //            var sheetTmp = app.GetObject<GenericObject>(feuilleId);
            //            if (sheetTmp != null)
            //                if (!String.IsNullOrEmpty(sheetTmp.GetChild(objetId).Info.Id)) nbObjetASupp++;                                    
            //        }
            //    }
            //}
            ////Si aucun objet à supprimer on retourne une liste vide
            //if (nbObjetASupp < 1) return _deletedObjets;

            //Sinon on supprime les objets des feuilles de base
            //Dupplication de l'application
            if (ServerMode) duplicatedApplicationName = selectedApplicationId + "_bis";
                    else duplicatedApplicationName = selectedApplicationId.Split('\\').Last().Replace(".qvf", "_bis.qvf");
                    //Renomage de l'application duppliquée pour le cas desktop 
                    duplicatedApplicationName = duplicatedApplicationName.Replace(".qvf_bis", "_bis.qvf");
                    string duplicatedAppId = CopyApplication(selectedApplicationId, duplicatedApplicationName);
                    //Vérifier que l'ID de l'application dupliqué est valide 
                    if (string.IsNullOrEmpty(duplicatedAppId)) throw new ArgumentException("Erreur SDKRemoveAppObjects.\n", "CopyApplication");
                    else
                    {
                        Dictionary<int, MyAppDescription> _app = FindApp(duplicatedAppId);
                        if (_app.ContainsKey(1))
                        {
                            IApp app;
                            using (app = _app[1].application)
                            {
                                //Suppression des objets dans l'application dupliquée
                                foreach (var objet in _objets)
                                {
                                    if (!_deletedObjets.Contains(objet))
                                    {
                                        
                                        string feuilleId = objet.Split('/')[0];
                                        string objetId = objet.Split('/')[1];
                                        var sheetTmp = app.GetObject<GenericObject>(feuilleId);
                                        if (sheetTmp != null)
                                        {
                                            if (!String.IsNullOrEmpty(sheetTmp.GetChild(objetId).Info.Id))
                                            {
                                                if (sheetTmp.DestroyChild(objetId)) _deletedObjets.Add(objet);
                                            }
                                        }
                                    }
                                }

                                //Variable supprimées > 0 : sauvegarde de l'application + remplacement + suppression
                                if (_deletedObjets.Count() > 0)
                                {
                                    //Sauvegarde application
                                    UpdateTimeOut(200);
                                    app.DoSave(duplicatedAppId);
                                    UpdateTimeOut(30);
                                    ReplaceApplication(selectedApplicationId, duplicatedAppId);                                    
                                }
                                //Dans tous les cas, supprime l'application duppliquée
                                if (ServerMode) QRSDeleteApplication(duplicatedAppId);
                            }
                        }
                    }
                }
                return _deletedObjets;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur SDKRemoveAppObjects.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // Methode de test
        //----------------------------------------------------------------------
        //public void Test(String strAppID)
        public void Test()
        {
            try
            {
                string sessionId = Location.SessionCookie.Replace("X-Qlik-Session=", "");

                string[] endpoint  = new string[10];
                endpoint[0] = "/qrs/user/full";
                endpoint[1] = "/qps/session/";
                endpoint[2] = "/qps/session/full";
                endpoint[3] = "/qps/session/" + sessionId;

                string uri = endpoint[2];

                if(uri.ToUpper().Contains("/QPS/")) RestClient.AsDirectConnection(true);
                else RestClient.AsNtlmUserViaProxy();

                string reponseJson = RestClient.Get(uri);
                Console.WriteLine(reponseJson);

                //Etat de l'application
                //QRSApplicationState(strAppID);

                //Infos Repository
                //QRSQrsAbout();

                //Récupérer un ticket
                //String ticketID = QRSArchivageGetTicket(strAppID);
                //Console.WriteLine(ticketID);
            }
            catch (Exception)
            {
                Console.WriteLine("Erreur Test.\n");
                throw;
            }
            
        }
        //----------------------------------------------------------------------
        // Modifier le timeout
        //----------------------------------------------------------------------
        static void UpdateTimeOut(int timeSeconde)
        {
            Qlik.Engine.Communication.QlikConnection.Timeout = timeSeconde * 1000;
        }

        //-----------------------------------------------------------------------------------
        // Création ou MAJ de dimensions, mesures, variables en passant par une appli tampon
        //-----------------------------------------------------------------------------------        
        public List<MAJDimMes> DimMesCreateOrUpdate(string applicationId, string xlsDictionnaryPath)
        {

            //Id application tampon
            string duplicatedAppId = String.Empty;
            try
            {
                //Lecture des des objets (dimension ou mesure ou ...) à MAJ ou créer
                List<MAJDimMes> _objets = new List<MAJDimMes>();
                _objets = ReadXlsxFile(xlsDictionnaryPath);
                if (_objets.Count >= 0)
                {
                    //Nom de l'application tampon
                    string duplicatedApplicationName = String.Empty;
                    if (ServerMode) duplicatedApplicationName = applicationId + "_DimMesCreateOrUpdate";                                //Cas serveur
                    else duplicatedApplicationName = applicationId.Split('\\').Last().Replace(".qvf", "_DimMesCreateOrUpdate.qvf");     //Cas desktop

                    //Création de l'application tampon
                    duplicatedAppId = CopyApplication(applicationId, duplicatedApplicationName);

                    //Vérifier que l'ID de l'application dupliqué est valide 
                    if (string.IsNullOrEmpty(duplicatedAppId)) throw new ArgumentException("Erreur SDKRemoveVariable.\n", "CopyApplication");

                    //Traitement des objets en MAJ ou Création
                    _objets = SDKDimMesCreateOrUpdate(duplicatedAppId, _objets);

                    //Suite à la création ou MAJ, met l'id du fichier xls à jour
                    UpdateXlsxFile(xlsDictionnaryPath, _objets);

                    //Remplacement de l'application d'origine par l'application tampon
                    ReplaceApplication(applicationId, duplicatedAppId);
                    //Suppression de l'application tampon
                    if (ServerMode) QRSDeleteApplication(duplicatedAppId);
                    //Forcage du propriétaire de l'application pour recalcul des objets de l'application (mesure et dim)
                    if (ServerMode) QRSChangeAppOwner(applicationId);
                }
                //Retour de la liste des objets traités avec propriete "Done" (CRT ou MAJ)
                return _objets;
            }
            catch (Exception)
            {
                MessageErreur += "Erreur DimMesCreateOrUpdate.\n";
                //Suppression de l'application tampon si elle a été créée
                if (ServerMode && !String.IsNullOrEmpty(duplicatedAppId)) QRSDeleteApplication(duplicatedAppId);
                throw;
            }
        }


        //----------------------------------------------------------------------
        // SDK - Création ou MAJ de dimensions, mesures, variables ...
        //----------------------------------------------------------------------        
        public List<MAJDimMes> SDKDimMesCreateOrUpdate(string applicationId, List<MAJDimMes> _ObjetATraiter)
        {
            
            try
            {
                //Ouverture de l'application
                Dictionary<int, MyAppDescription> _app = FindApp(applicationId);
                if (_app.ContainsKey(1))
                {

                    Dictionary<string, MAJDimMes> _dictionaryAppDimensions = new Dictionary<string, MAJDimMes>();
                    Dictionary<string, MAJDimMes> _dictionaryAppMeasures = new Dictionary<string, MAJDimMes>();
                    Dictionary<string, MAJDimMes> _dictionaryAppVariables = new Dictionary<string, MAJDimMes>();
                    CreateDictionariesAppObject(_app[1], ref _dictionaryAppDimensions, ref _dictionaryAppMeasures, ref _dictionaryAppVariables);

                    IApp app;
                    using (app = _app[1].application)
                    {

                        //Nombre de modification apportée
                        int nbModif = 0;

                        foreach (var objetXls in _ObjetATraiter)
                        {
                            //Vérifie Objet correctement définit dans Xls
                            if (IsToProcess(objetXls))
                            { 

                                //
                                Dictionary<string, MAJDimMes> appDictionnaireAInterroger = new Dictionary<string, MAJDimMes>();
                                if (objetXls.nature.Equals("Dimension")) appDictionnaireAInterroger = _dictionaryAppDimensions;
                                else if (objetXls.nature.Equals("Mesure")) appDictionnaireAInterroger = _dictionaryAppMeasures;
                                else if (objetXls.nature.Equals("Variable")) appDictionnaireAInterroger = _dictionaryAppVariables;

                                //Condition de base pour que l'objet soit traité : avoir un nom dans le xls
                                if (!String.IsNullOrEmpty(objetXls.nom))
                                {
                                    
                                    //---Etape 1 : Recherche dans Qlik de l'objet paramétré dans Xls

                                    MAJDimMes objetQlik = new MAJDimMes();
                                    //Id xls vide => recherche par nom
                                    if (string.IsNullOrEmpty(objetXls.id))
                                    {
                                        objetQlik = GetObjectByName(appDictionnaireAInterroger, objetXls.nom);
                                    }
                                    //Id xls renseigné => recherche par id
                                    else appDictionnaireAInterroger.TryGetValue(objetXls.id, out objetQlik);

                                    //---Etape 2 : Recherche si l'objet est à creer ou à mettre à jour?

                                    //Si objet Xls trouvé dans Qlik (via ID ou nom) => MAJ
                                    if (objetQlik != null)
                                    {
                                        //Si l'objet existe dans Qlik sans id de précisé dans xls, MAJ info xls
                                        if (String.IsNullOrEmpty(objetXls.id)) objetXls.id = objetQlik.id;

                                        ObjetUpdate(app, objetXls);
                                        objetXls.done = "UPD";
                                        nbModif++;

                                        //Dans tous les cas on à jour le fichier xls avec les infos de Qlik
                                        if (String.IsNullOrEmpty(objetXls.id)) objetXls.id = objetQlik.id; //Cas où id déjà existant, MAJ du nouvel id dans xls
                                        if (String.IsNullOrEmpty(objetXls.etiquette)) objetXls.etiquette = objetQlik.etiquette;
                                        if (String.IsNullOrEmpty(objetXls.expression)) objetXls.expression = objetQlik.expression;
                                        if (String.IsNullOrEmpty(objetXls.description)) objetXls.description = objetQlik.description;
                                        if (String.IsNullOrEmpty(objetXls.type)) objetXls.type = objetQlik.type;
                                    }
                                    //Si objet Xls non trouvé dans Qlik (via ID ou nom) => "Création"
                                    else
                                    {
                                        objetXls.id = ObjetCreate(app, objetXls);
                                        objetXls.done = "CRT";
                                        nbModif++;
                                    }
                                }
                            }
                        }
                        //MAJ application
                        if (nbModif > 0)
                        {
                            UpdateTimeOut(300);
                            app.DoSave();
                            UpdateTimeOut(30);
                        }
                    }
                    
                }

                //Retour de la liste avec propriete "Done" (CRT ou MAJ)
                return _ObjetATraiter;
            }
            catch (Exception)
            {
                MessageErreur += "Erreur SDKDimMesCreateOrUpdate.\n";
                throw;
            }
        }
        //----------------------------------------------------------------------        
        //Renvoi l'objet du dictionnaire par son nom
        //----------------------------------------------------------------------        
        public MAJDimMes GetObjectByName(Dictionary<string, MAJDimMes> dictionary, string name)
        {
            return dictionary.Values.FirstOrDefault(o => o.nom == name);
        }
        //----------------------------------------------------------------------        
        //Vérifie que l'objet est conforme pour être traité        
        //----------------------------------------------------------------------        
        private static  bool IsToProcess(MAJDimMes objet)
        {

            try
            {
                bool aTraiter = true;

                if (String.IsNullOrEmpty(objet.nom) ||
                    String.IsNullOrEmpty(objet.expression) ||
                    (String.IsNullOrEmpty(objet.type) && objet.nature.Equals("Dimension")) )

                    aTraiter = false;

                return aTraiter;
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        //----------------------------------------------------------------------
        // MAJ Mesures - Création de la liste des patchs
        /*
                 -- Mesures : chemins JSON
                    --qInfo
                    /qInfo/qId 
                    /qInfo/qType 
                    --qMetaDef
                    /qMetaDef/title //Nom
                    /qMetaDef/description //Description
                    /qMetaDef/tags (tab)
                    --qMeasure
                    /qMeasure/qLabel
                    /qMeasure/qDef
                    /qMeasure/qGrouping
                    /qMeasure/qExpressions (tab)
                    /qMeasure/qActiveExpression
                    /qMeasure/qLabelExpression //Etiqueter l'expression
                    /qMeasure/coloring
         */
        //----------------------------------------------------------------------        
        public static List<NxPatch> CreateMeasurePatches(MAJDimMes objetATraiter)
        {

            try
            {
                List<NxPatch> _modif = new List<NxPatch>();

                //Nom
                _modif = AddPatch(_modif, "/qMeasure/qLabel", "\"" + objetATraiter.nom + "\"");
                _modif = AddPatch(_modif, "/qMetaDef/title", "\"" + objetATraiter.nom + "\"");

                //Nom (étiquette)
                _modif = AddPatch(_modif, "/qMeasure/qLabelExpression", "\"" + objetATraiter.etiquette + "\"");

                //Expression
                _modif = AddPatch(_modif, "/qMeasure/qDef", "\"" + objetATraiter.expression + "\"");

                //Description
                _modif = AddPatch(_modif, "/qMetaDef/description", "\"" + objetATraiter.description + "\"");
                
                return _modif;
            }
            catch (Exception)
            {
                throw;
            }
        }

        //----------------------------------------------------------------------
        // MAJ Dimension - Création de la liste des patchs
        /*
                 -- Dimensions : chemins JSON
                    --qInfo
                    /qInfo/qId 
                    /qInfo/qType 
                    --qDim
                    /qDim/qGrouping //U ou H = Hierarchique
                    /qDim/qFieldDefs (tab) //Liste des champs (plusieurs si hierarchique) 
                    /qDim/qFieldLabels (tab) 
                    /qDim/qLabelExpression //Etiqueter l'expression
                    /qDim/title //Nom Apriori à ne pas utilisé car introuvable via createdimension et donc créer une erreur
                    /qDim/coloring/colorMapRef
                    /qDim/coloring/changeHash
                    --qMetaDef
                    /qMetaDef/title //Nom
                    /qMetaDef/description //Description
                    /qMetaDef/tags (tab)
                 */
        //----------------------------------------------------------------------        
        public static List<NxPatch> CreateDimensionPatches(MAJDimMes objetATraiter)
        {
            try
            {
                List<NxPatch> _modif = new List<NxPatch>();

                //Nom
                //_modif = AddPatch(_modif, "/qDim/title", "\"" + objetATraiter.nom + "\"");
                _modif = AddPatch(_modif, "/qMetaDef/title", "\"" + objetATraiter.nom + "\"");

                //Nom (étiquette)
                _modif = AddPatch(_modif, "/qDim/qLabelExpression", "\"" + objetATraiter.etiquette + "\"");

                //Expression
                string qFieldDefs = String.Empty;
                string qFieldLabels = String.Empty;
                string HierarchFieldSeparator = "<H/>";
                //Mise en forme de l'expression selon dimension hierarchique ou non
                //si plusieurs champs et type hierarchique
                if (objetATraiter.expression.Contains(HierarchFieldSeparator) && objetATraiter.type.Trim().Equals("H"))
                {
                    qFieldDefs = "[\"" + objetATraiter.expression.Replace(HierarchFieldSeparator, "\", \"") + "\"]";
                }
                //Si 1 seul champ et type unique
                else if (!objetATraiter.expression.Contains(HierarchFieldSeparator) && objetATraiter.type.Trim().Equals("N"))
                {
                    qFieldDefs = "[\"" + objetATraiter.expression + "\"]";
                    qFieldLabels = "[\"" + objetATraiter.nom + "\"]";
                }
                //Si incohérence (ex un seul champ mais definit comme hierarchique) on ne traite pas
                else
                {
                    //JLEP pour test
                    //_modif = AddDimensionPatch(_modif, "/qDim/qLabelExpression", "\"" + "'-> Par API /3'" + "\"");
                }
                if(!string.IsNullOrEmpty(qFieldDefs)) _modif = AddPatch(_modif, "/qDim/qFieldDefs", qFieldDefs);
                if(!string.IsNullOrEmpty(qFieldLabels)) _modif = AddPatch(_modif, "/qDim/qFieldLabels", qFieldLabels);

                //Description
                _modif = AddPatch(_modif, "/qMetaDef/description", "\"" + objetATraiter.description + "\"");
                
                //Type
                _modif = AddPatch(_modif, "/qDim/qGrouping", "\"" + objetATraiter.type + "\"");

                //title
                _modif = AddPatch(_modif, "/qDim/title", "\"" + objetATraiter.nom + "\"", NxPatchOperationType.Add);

                return _modif;
            }
            catch (Exception)
            {
                throw;
            }
        }

        //----------------------------------------------------------------------
        // MAJ Dimension - Création du patch et ajouts à la listes de patch
        //----------------------------------------------------------------------        
        public static List<NxPatch> AddPatch(List<NxPatch> _patches, string jsonPath, string jsonValue, NxPatchOperationType operation = NxPatchOperationType.Replace)
        {

            try
            {
                //Teste si le champs n'est pas vide (hors caractères speciaux)
                string testJsonValue = jsonValue;
                testJsonValue = testJsonValue.Replace("\"", "");
                testJsonValue = testJsonValue.Replace("[", "");
                testJsonValue = testJsonValue.Replace("]", "");
                testJsonValue = testJsonValue.Replace("<H/>", "");

                if (!String.IsNullOrEmpty(testJsonValue))
                {
                    NxPatch patch = new NxPatch();
                    patch.Op = operation; //Add, Remove or replace
                    patch.Path = jsonPath;
                    patch.Value = jsonValue;
                    _patches.Add(patch);
                }

                return _patches;
            }
            catch (Exception)
            {
                throw;
            }
        }

        //----------------------------------------------------------------------
        // SDK - MAJ de dimensions, mesures, variables ...
        //----------------------------------------------------------------------        
        public void ObjetUpdate(IApp app, MAJDimMes objetATraiter)
        {

            try
            {
                
                //Traitement des dimensions
                if (objetATraiter.nature.Equals("Dimension"))
                {
                    List<NxPatch> _modif = CreateDimensionPatches(objetATraiter);
                    app.GetDimension(objetATraiter.id).ApplyPatches(_modif);
                }
                //Traitement des mesures
                else if (objetATraiter.nature.Equals("Mesure"))
                {
                    List<NxPatch> _modif = CreateMeasurePatches(objetATraiter);
                    app.GetMeasure(objetATraiter.id).ApplyPatches(_modif);

                }
                //Traitement des variables (TODO)
                else if (objetATraiter.type.Equals("Variables"))
                {

                }              
            
                        
            }
            catch (Exception)
            {
                MessageErreur = "Erreur ObjetUpdate sur l'objet : " + objetATraiter.id + " - " + objetATraiter.nom + ".\n Vérifier que son Id dans le fichier soit correct.\n";
                throw;
            }
        }

        //----------------------------------------------------------------------
        // SDK - Création de dimensions, mesures, variables ...
        //----------------------------------------------------------------------        
        public string ObjetCreate(IApp app, MAJDimMes objetATraiter)
        {

            try
            {
                //Id de l'objet créé renvoyé par la méthode
                string newObjetID = String.Empty;

                //Création des dimensions
                if (objetATraiter.nature.Equals("Dimension"))
                {
                    //-----Dim
                    NxLibraryDimensionDef newDim_dim = new NxLibraryDimensionDef();

                    newDim_dim.LabelExpression = objetATraiter.etiquette;

                    newDim_dim.FieldDefs = objetATraiter.expression.Split(',').ToList<string>();
                    if (objetATraiter.type.Trim().Equals("N")) newDim_dim.FieldLabels = objetATraiter.nom.Split(',').ToList<string>();

                    if (objetATraiter.type.Trim().Equals("N")) newDim_dim.Grouping = NxGrpType.GRP_NX_NONE;
                    if (objetATraiter.type.Trim().Equals("H")) newDim_dim.Grouping = NxGrpType.GRP_NX_HIEARCHY;
                    if (objetATraiter.type.Trim().Equals("C")) newDim_dim.Grouping = NxGrpType.GRP_NX_COLLECTION;

                    //-----Info
                    NxInfo newDim_info = new NxInfo();
                    newDim_info.Type = "dimension";
                    if(!string.IsNullOrEmpty(objetATraiter.id)) newDim_info.Id = objetATraiter.id;

                    //-----MetaDef
                    /*MetaAttributesDef newDim_metaDef = new MetaAttributesDef();
                    newDim_metaDef.Title = objetATraiter.nom;
                    newDim_metaDef.Description = objetATraiter.description;*/
                    MetaAttributesDef newDim_metaDef = new MetaAttributesDef
                    {
                        Title = objetATraiter.nom,
                        Description = objetATraiter.description
                    };
                    newDim_metaDef.Description = objetATraiter.description;

                    //-----Session??

                    DimensionProperties newDimProperties = new DimensionProperties();
                    newDimProperties.Dim = newDim_dim;
                    newDimProperties.Info = newDim_info;
                    newDimProperties.MetaDef = newDim_metaDef;
                    IDimension newDimension = app.CreateDimension(newObjetID, newDimProperties);

                    /*IGenericDimension newDimensionG = (IGenericDimension) newDimension;
                    newDimensionG.Publish();
                    newDimensionG.Approve();*/
                    
                    newObjetID = newDimension.Id;

                    //Ajout title
                    List<NxPatch> _patches = new List<NxPatch>();
                    _patches = AddPatch(_patches, "/qDim/title", "\"" + objetATraiter.nom + "\"", NxPatchOperationType.Add);
                    app.GetDimension(newDimension.Id).ApplyPatches(_patches);

                }
                //Création des mesures
                else if (objetATraiter.nature.Equals("Mesure"))
                {
                    /*
                        /qMetaDef/title
                        /qMetaDef/description
                        /qMeasure/qLabel
                        /qMeasure/qLabelExpression
                        /qMeasure/qDef  
                    */
                    //-----Info
                    NxInfo newMeas_info = new NxInfo();
                    newMeas_info.Type = "mesure";

                    //-----MetaDef
                    MetaAttributesDef newMeas_metaDef = new MetaAttributesDef();
                    newMeas_metaDef.Title = objetATraiter.nom;
                    newMeas_metaDef.Description = objetATraiter.description;

                    //-----Session??

                    //-----Measure
                    NxLibraryMeasureDef newMeas_measure = new NxLibraryMeasureDef();
                    newMeas_measure.Label = objetATraiter.nom;
                    newMeas_measure.LabelExpression = objetATraiter.etiquette;
                    newMeas_measure.Def= objetATraiter.expression;
                    
                    MeasureProperties newMeasProperties = new MeasureProperties();
                    newMeasProperties.Info = newMeas_info;
                    newMeasProperties.MetaDef = newMeas_metaDef;
                    newMeasProperties.Measure = newMeas_measure;

                    IMeasure newMeasure = app.CreateMeasure(newObjetID, newMeasProperties);

                    //newMeasure.Publish();
                    //newMeasure.Approve();
                    newObjetID = newMeasure.Id;
                }
                //Création des variables (TODO)
                else if (objetATraiter.type.Equals("Variables"))
                {

                }


                return newObjetID;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur ObjetCreate.\n";
                throw;
            }
        }

        private void writeline(string id)
        {
            throw new NotImplementedException();
        }

        //-----------------------------------------------------------------------------
        // Création des dictionnaires de l'application (dimension, mesures, variables)
        //-----------------------------------------------------------------------------
        private static void CreateDictionariesAppObject(MyAppDescription myApp, ref Dictionary<string, MAJDimMes> _dictionaryDimensions, ref Dictionary<string, MAJDimMes> _dictionaryMeasures, ref Dictionary<string, MAJDimMes> _dictionaryVariables)
        {
            Dictionary<string, MAJDimMes> _dictionaryAppObject = new Dictionary<string, MAJDimMes>();

            //Dictionnaire des dimensions de l'application
            foreach (var elem in myApp.structure.getDimensionList)
            {
                string id = elem.Info.Id;
                DimensionProperties dimProperties = elem.Properties;
                MAJDimMes dictionnaireObjet = new MAJDimMes();

                dictionnaireObjet.id = dimProperties.Info.Id;
                dictionnaireObjet.nom = dimProperties.MetaDef.Title;
                dictionnaireObjet.etiquette = dimProperties.Dim.LabelExpression;
                dictionnaireObjet.description = dimProperties.MetaDef.Description;
                dictionnaireObjet.expression = string.Join("<H/>", dimProperties.Dim.FieldDefs);
                dictionnaireObjet.type = dimProperties.Dim.Grouping.ToString();
                if (dimProperties.Dim.Grouping == NxGrpType.GRP_NX_NONE) dictionnaireObjet.type = "N";
                if (dimProperties.Dim.Grouping == NxGrpType.GRP_NX_HIEARCHY) dictionnaireObjet.type = "H";
                if (dimProperties.Dim.Grouping == NxGrpType.GRP_NX_COLLECTION) dictionnaireObjet.type = "C";

                _dictionaryDimensions.Add(id, dictionnaireObjet);

            }

            //Dictionnaire des mesures de l'application
            foreach (var elem in myApp.structure.getMeasureList)
            {
                string id = elem.Info.Id;
                MeasureProperties measProperties = elem.Properties;
                MAJDimMes dictionnaireObjet = new MAJDimMes();

                dictionnaireObjet.id = measProperties.Info.Id;
                dictionnaireObjet.nom = measProperties.MetaDef.Title;
                dictionnaireObjet.etiquette = measProperties.Measure.LabelExpression;
                dictionnaireObjet.description = measProperties.MetaDef.Description;
                dictionnaireObjet.expression = measProperties.Measure.Def;
                //dictionnaireObjet.type = measProperties.Measure.Grouping.ToString();

                _dictionaryMeasures.Add(id, dictionnaireObjet);

            }

            //Dictionnaire des variables de l'application
            foreach (var elem in myApp.structure.getVariableList)
            {
                string id = elem.Info.Id;
                GenericVariableProperties varProperties = elem.Properties;
                MAJDimMes dictionnaireObjet = new MAJDimMes();

                dictionnaireObjet.id = varProperties.Info.Id;
                //TODO si besoin
                //dictionnaireObjet.nom = varProperties.MetaDef.Title;
                //dictionnaireObjet.etiquette = varProperties.Measure.LabelExpression;
                //dictionnaireObjet.description = varProperties.MetaDef.Description;
                //dictionnaireObjet.expression = varProperties.Measure.Def;
                //dictionnaireObjet.type = varProperties.Measure.Grouping.ToString();

                _dictionaryVariables.Add(id, dictionnaireObjet);

            }

        }
        ///<summary> 
        /// This method is an example on how a session cookie can be extracted.
        /// It opens up a connection towards Qlik Sense Server on given 
        /// uri and extracts the session id 'X-Qlik-Session' from the response cookies
        ///<summary> 
        ///<returns>session cookie<returns>
        public Cookie ExtractTicketFromCookies()
        {
            //var _qlikSenseServerUri = new Uri(https://mydomaine.com);
            var _qlikSenseServerUri = new Uri(Host);

            CookieContainer cookieContainer = new CookieContainer();
            var connectionHandler = new HttpClientHandler
            {
                UseDefaultCredentials = true,
                CookieContainer = cookieContainer
            };
            /*var connection = new HttpClient(connectionHandler);

            connection.DefaultRequestHeaders.Add("X-Qlik-xrfkey", "ABCDEFG123456789");
            connection.DefaultRequestHeaders.Add("User-Agent", "Windows");

            connection.GetAsync(_qlikSenseServerUri).Wait();*/

            IEnumerable<Cookie> responseCookies = cookieContainer.GetCookies(_qlikSenseServerUri).Cast<Cookie>();

            return responseCookies.First(cookie => cookie.Name.Equals("X-Qlik-Session"));
        }
        public Cookie ExtractTicketFromCookies(Uri uri)
        {
            //var _qlikSenseServerUri = new Uri(https://mydomaine.com);
            var _qlikSenseServerUri = uri;

            CookieContainer cookieContainer = new CookieContainer();
            var connectionHandler = new HttpClientHandler
            {
                UseDefaultCredentials = true,
                CookieContainer = cookieContainer
            };
            var connection = new HttpClient(connectionHandler);

            connection.DefaultRequestHeaders.Add("X-Qlik-xrfkey", "ABCDEFG123456789");
            connection.DefaultRequestHeaders.Add("User-Agent", "Windows");

            connection.GetAsync(_qlikSenseServerUri).Wait();

            IEnumerable<Cookie> responseCookies = cookieContainer.GetCookies(_qlikSenseServerUri).Cast<Cookie>();

            return responseCookies.First(cookie => cookie.Name.Equals("X-Qlik-Session"));
        }

        //--------------------------------------------------------
        // Connexion : purge des connexions existante
        //--------------------------------------------------------
        public void PurgeConnexion()
        {
            try
            {
                if (Location.IsAlive()) QPSDeleteSession();
            }
            catch (Exception)
            {
                throw;
            }
        }

        //--------------------------------------------------------
        // Connexion serveur : récupère métadata (mise en forme HTML)
        //--------------------------------------------------------
        public string GetHtmlServeurInfos()
        {
            try
            {
                string infos = "";
                //Liste Streams
                List<string> _stream = JsonGetListeStream(_InfosApplicationParAppId, "");
                //Liste applications
                List<string> _appli = JsonGetListeAppOfStream("", _InfosApplicationParAppId);

                //Qlik Indexing Engine[version moteur] = 12.287.2[Engine 64 - bit Edition(x64)] <br/> Système d'exploitation [version] = WindowsNT [6.2.9200]<br/><br/>Nb utilisateurs (actifs/total): 0/0<br/><br/>Session SDK = Connexion par certificat<br/>Session REST = X-Qlik-Session-HTTP=1e9a4b29-48fc-4751-a35f-6223f5643407<br/><br/>Nombre total de flux = 10 (5 finaux + 5 personnels)<br/>Nombre Total d'application = 73"
                //Infos Qlik serveur 
                int nbStream = _stream.Count - 1; //(1ère valeur à blanc dans tableau)
                int nbStreamWorkflow = GetNbOfOccurInList(_stream, "Mon travail", false);
                int nbStreamFinal = nbStream - nbStreamWorkflow;
                infos += "Qlik Indexing Engine [version moteur]= " + EngineVersion;
                infos += "<br/>Système d'exploitation [version] = " + OsVersion;
                infos += "<br/>Nb utilisateurs (actifs/total): " + NbActiveUser + "/" + NbTotalUser;
                infos += "<br/>Session SDK = " + SessionSDK;
                infos += "<br/>Session REST = " + SessionREST;
                infos += "<br/>Nombre total de flux = " + nbStream;
                infos += " (" + nbStreamFinal;
                if (nbStreamFinal > 1) infos += " finaux + ";
                else infos += " final + ";
                infos += nbStreamWorkflow;
                if (nbStreamWorkflow > 1) infos += " personnels)";
                else infos += " personnel)";

                infos += "<br/>Nombre Total d'application = " + (_appli.Count - 1);

                return infos;
            }
            catch (Exception)
            {
                return "Erreur GetHtmlServeurInfos";
            }
        }
        //--------------------------------------------------------
        // Connexion flux : récupère métadata (mise en forme HTML)
        //--------------------------------------------------------
        public string GetHtmlFluxInfos(string fluxName)
        {
            try
            {
                string infos = "";
                //Liste Streams
                List<string> _stream = JsonGetListeStream(_InfosApplicationParAppId, "");
                //Liste applications
                List<string> _appli = JsonGetListeAppOfStream(fluxName, _InfosApplicationParAppId);

                int nbAppli = _appli.Count - 1;  //(1ère valeur à blanc dans tableau)
                int nbAppliNotPublished = GetNbOfOccurInList(_appli, "-(NP)", false); //(1ère valeur à blanc dans tableau)
                int nbAppliPublished = nbAppli - nbAppliNotPublished;
                infos += "Nombre total d'application = " + nbAppli;
                infos += "<br/>->  publiées = " + nbAppliPublished;
                infos += "<br/>->  non publiées = " + nbAppliNotPublished;

                return infos;
            }
            catch (Exception)
            {
                return "Erreur GetHtmlFluxInfos";
            }
        }
        //-----------------------------------------------------------------------------------------
        // Connexion applications : renvoie métadata des applications du flux (mise en forme HTML)
        //-----------------------------------------------------------------------------------------
        public Dictionary<string,string> GetHtmlApplicationsInfos(string fluxName)
        {
            try
            {
                Dictionary<string, string> _applicationInfos = new Dictionary<string, string>();
                List<QRSHubListFullJson> _HubInfoAppliJson = new List<QRSHubListFullJson>();

                foreach (KeyValuePair<string, QRSHubListFullJson> app in _InfosApplicationParAppId)
                {
                    if (app.Value.stream.name == fluxName)
                    {
                        string key = app.Value.name;

                        string value = "Propriétaire = " + app.Value.owner.name + " (" + app.Value.owner.userId + ")";
                        value += "<br/>Date de dernière modification = " + app.Value.modifiedDate;
                        value += "<br/>Utilisateur de la dernière modification = " + app.Value.modifiedByUserName;
                        value += "<br/>Taille application (avec données) - QMC = " + app.Value.fileSize + "Mo";

                        _applicationInfos.Add(key, value);

                    }
                }
                return _applicationInfos;

            }
            catch (Exception)
            {
                return new Dictionary<string, string> { { "0", "Erreur GetHtmlFluxInfos" } };
            }
        }
        //-----------------------------------------------------------------------------------------
        // Connexion applications : renvoie métadata des applications du flux (mise en forme HTML)
        //-----------------------------------------------------------------------------------------
        public string JsonCreateExport(string selectedApplicationId, string exportDir, bool isToBeClean = false)
        {
            try
            {
                string fullFileName = "";
                using (IHub hub = Location.Hub())
                {
                    //Récupère les infos de l'application correspondant à selectedApplicationId
                    Dictionary<int, MyAppDescription> _app = FindApp(selectedApplicationId, true);
                    if (_app.ContainsKey(1))
                    {
                        //Application à traiter
                        var application = _app.First().Value;
                                                
                        //Préparation des données à écrire
                        List<string> _jsonApp = new List<string>();

                        _jsonApp.Add("{");
                        _jsonApp.Add("\"getAllInfos\" : " + JsonConvert.SerializeObject(application.structure.getAllInfos) + ",");
                        _jsonApp.Add("\"getAppLayout\" : " + JsonConvert.SerializeObject(application.structure.getAppLayout) + ",");
                        _jsonApp.Add("\"getAppProperties\" : " + JsonConvert.SerializeObject(application.structure.getAppProperties) + ",");
                        _jsonApp.Add("\"getVariableList\" : " + JsonConvert.SerializeObject(application.structure.getVariableList) + ",");
                        _jsonApp.Add("\"getFieldList\" : " + JsonConvert.SerializeObject(application.structure.getFieldList) + ",");
                        //_jsonApp.Add("\"getListboxList\" : " + JsonConvert.SerializeObject(application.structure.getListboxList) + ",");
                        _jsonApp.Add("\"getListboxList\" : " + JsonConvert.SerializeObject(application.structure.getListboxList.Select(o => o.Properties).ToList()) + ",");
                        _jsonApp.Add("\"getMeasureList\" : " + JsonConvert.SerializeObject(application.structure.getMeasureList) + ",");
                        _jsonApp.Add("\"getDimensionList\" : " + JsonConvert.SerializeObject(application.structure.getDimensionList) + ",");
                        _jsonApp.Add("\"getMediaList\" : " + JsonConvert.SerializeObject(application.structure.getMediaList) + ",");
                        _jsonApp.Add("\"getSnapshotList\" : " + JsonConvert.SerializeObject(application.structure.getSnapshotList));
                        _jsonApp.Add("}");
                        //_jsonApp.Add(JsonConvert.SerializeObject(application.structure));

                        //Nettoyage demandé
                        if (isToBeClean)
                        {
                            //Passe par une liste temporaire
                            List<string> _tmpJsonAppCleaned = new List<string>();
                            foreach (var elem in _jsonApp)
                            {
                                string tmp = Regex.Replace(elem, @"([0-9]{2}/[0-9]{2}/[0-9]{4}[\s]{1}[0-9]{2}:[0-9]{2}:[0-9]{2})", "");
                                tmp = Regex.Replace(tmp, @"([0-9]{4}-[0-9]{2}-[0-9]{2}[_]{1}[0-9]{2}-[0-9]{2}-[0-9]{2})", "");
                                _tmpJsonAppCleaned.Add(tmp);
                            }
                            _jsonApp = new List<string>();
                            _jsonApp = _tmpJsonAppCleaned;
                        }

                        //Si le répertoire n'existe pas on le créer
                        ExistOrCreate(exportDir);
                        //Constiution du nom des fichiers
                        fullFileName = exportDir + _app[1].appIdentifier.AppName + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".json";
                        //Ecriture du fichier
                        WriteTabToFile(_jsonApp, fullFileName);
                    }
                }
                return fullFileName;
            }
            catch
            {
                return "";
            }
        }
        //-----------------------------------------------------------------------------------------
        // Ajoute la structure de l'application dans la description
        //-----------------------------------------------------------------------------------------
        private MyAppStructure SerializeApp(MyAppDescription appDescription)
        {
            
            MyAppStructure structure = new MyAppStructure();
            try
            {
                structure.getAllInfos = appDescription.application.GetAllInfos();
                structure.getAppLayout = appDescription.application.GetAppLayout();
                structure.getAppProperties = appDescription.application.GetAppProperties();
                structure.getMediaList = appDescription.application.GetMediaList();
                structure.getSnapshotList = appDescription.application.GetSnapshotList();

                structure.getDimensionList = (List<IDimension>)GetGenericObjectList(appDescription.application, "dimensions");
                structure.getMeasureList = (List<IMeasure>)GetGenericObjectList(appDescription.application, "measures");
                structure.getVariableList= (List<GenericVariable>)GetGenericObjectList(appDescription.application, "variables");
                structure.getFieldList = (List<IField>)GetGenericObjectList(appDescription.application, "fields");

                structure.getListboxList = (List<IListbox>)GetGenericObjectList(appDescription.application, "listbox");

                //TO DO :
                //Via methode SerializeApp, ajouter Les classes :
                //getDimensions
                //getFields
                //getList
                //getMeasures
                //getMediaList
                //getSnapshots
                //getVariables
                //getLayout
                //getProperties
                //cf https://github.com/mindspank/serializeapp/blob/master/lib/getList.js


                /*//Récupère la liste des dimensions de l'application
                                appDescription._appDimension = new Dictionary<string, DimensionProperties>();
                                var layout = appDescription.application.GetDimensionList().GetLayout();
                                var listItems = layout.As<DimensionListLayout>().DimensionList.Items;
                                foreach (var dim in listItems)
                                {
                                    DimensionProperties tmpDimProp = appDescription.application.GetDimension(dim.Info.Id).Properties;
                                    appDescription._appDimension.Add(dim.Info.Id, tmpDimProp);
                                }

                                //Récupère la liste des mesures de l'application
                                appDescription._appMesure = new Dictionary<string, MeasureProperties>();
                                layout = appDescription.application.GetMeasureList().GetLayout();
                                var listMesure = layout.As<MeasureListLayout>().MeasureList.Items;
                                foreach (var mes in listMesure)
                                {
                                    MeasureProperties tmpMeasProp = appDescription.application.GetMeasure(mes.Info.Id).Properties;
                                    appDescription._appMesure.Add(mes.Info.Id, tmpMeasProp);
                                }

                                //Récupère la liste des variables de l'application
                                appDescription._appVariable = new Dictionary<string, GenericVariableProperties>();
                                layout = appDescription.application.GetVariableList().GetLayout();
                                var listVariable = layout.As<VariableListLayout>().VariableList.Items;
                                foreach (var vari in listVariable)
                                {
                                    GenericVariableProperties tmpVariProp = appDescription.application.GetVariableById(vari.Info.Id).Properties;
                                    appDescription._appVariable.Add(vari.Info.Id, tmpVariProp);
                                }*/
                return structure;
            }
            catch (Exception e)
            {
                return structure;
            }
        }
    }
}

