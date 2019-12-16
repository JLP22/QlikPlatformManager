using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace QlikUtils
{
    using OfficeOpenXml;
    using Qlik.Engine;
    using Qlik.Sense.Client;
    using Qlik.Sense.Client.Visualizations;
    using System.Collections.ObjectModel;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Management.Automation;
    using System.Management.Automation.Runspaces;
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    using System.Text;
    using static QlikObjectJson;

    public class Utilitaires
    {
        //----------------------------------------------------
        // Définition de classes
        //----------------------------------------------------

        public class MAJDimMes
        {
            public string nature { get; set; } //Dimension ou mesure
            public string id { get; set; }
            public string nom { get; set; }
            public string etiquette { get; set; }
            public string categorie { get; set; }
            public string expression { get; set; }
            public string description { get; set; }
            public string type { get; set; } //N (no grouping) / H (drill-down) / C (cyclic)
            public string done { get; set; } //objet traité (UPD ou CRT) 
            public int xlsLine { get; set; } //objet traité (UPD ou CRT) 
        }
        public class Macro
        {
            public string name { get; set; }
            public List<MacApplication> contenu { get; set; }
        }
        public class MacApplication
        {
            public string serveurSource { get; set; }
            public string streamSource { get; set; }
            public string applicationSource { get; set; }
            public string serveurCible { get; set; }
            public string streamCible { get; set; }
            public string applicationCible { get; set; }
        }
        public class ApplicationLot
        {
            public string appIdSource { get; set; }
            public string appNameSource { get; set; }
            public string appStreamSource { get; set; }
            public string appIdCible { get; set; }
            public string appNameCible { get; set; }
            public string appStreamCible { get; set; }
            public bool appLivrerApplication { get; set; }
            public bool appLivrerDonnees { get; set; }
            public bool appLivrerScript { get; set; }
            public string appScriptDirectory { get; set; }
            public string appEnvCible { get; set; }
        }

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

        public class MyAppStructure
        {
            public IEnumerable<NxInfo> getAllInfos { get; set; }
            public NxAppLayout getAppLayout { get; set; }
            public NxAppProperties getAppProperties { get; set; }
            public List<IDimension> getDimensionList { get; set; }
            public List<IMeasure> getMeasureList { get; set; }
            public List<IField> getFieldList { get; set; }
            public List<IListbox> getListboxList { get; set; }
            public List<GenericVariable> getVariableList { get; set; }
            public GetMediaListResult getMediaList { get; set; }
            public Qlik.Sense.Client.Snapshot.ISnapshotList getSnapshotList { get; set; }
        }
        public class ExportModeleApp
        {
            public string appName { get; set; }
            public string appId { get; set; }
            public int appPosition { get; set; }
            public int appNbtotal { get; set; }
            public int sheetNbtotal { get; set; }
            public IList<ExportModeleSheet> _sheet { get; set; }
            public MyAppStructure globalStructure { get; set; }
        }
        public class ExportModeleSheet
        {
            public string sheetTitle { get; set; }
            public string sheetId { get; set; }
            public QRSOwnerJson sheetOwner { get; set; }
            public string sheetType { get; set; }
            public int sheetPosition { get; set; }
            public int objectNbtotal { get; set; }
            public IList<ExportModeleObject> _object { get; set; }
            public IList<ExportModeleObject> _objectLayout { get; set; }
        }
        public class ExportModeleObject
        {
            public string objectTitle { get; set; }
            public string objectId { get; set; }
            public string objectType { get; set; }
            public int objectPosition { get; set; }
            public bool objectExistInLayout { get; set; }
            //public NxInfo settingJson { get; set; }
            public GenericObjectProperties settingJson { get; set; }
            public string objectExtension { get; set; }
            public HyperCubeDef objectHyperCubeDef { get; set; }
            public string layout { get; set; }
            public string dimensions { get; set; }
            public string mesures { get; set; }
            public IVisualizationBase json { get; set; }
        }

        public class FileAttributes
        {
            public FileInfo fileInfo { get; set; }
            public double SizeMo { get; set; }
            
        }

        //----------------------------------------------------
        // Variables de classe (globale)
        //----------------------------------------------------
        public static String MessageErreur;


        //--------------------------------------------------------
        // Ecrtiure d'un tableau de données dans un fichier texte
        //--------------------------------------------------------
        public static void WriteTabToFile(List<string> lines, string FileDir)
        {
            try
            {
                using (System.IO.StreamWriter file =
                new System.IO.StreamWriter(FileDir))
                {
                    foreach (string line in lines)
                    {
                        file.WriteLine(line);
                    }
                }
            }
            catch (Exception)
            {
                //MessageBox.Show(ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                //return false;
                MessageErreur = "Erreur WriteTabToFile.";
                throw;
            }
        }
        //--------------------------------------------------------------------------------------
        //Retourne le nombre d'occurence de strinToFind dans la liste 
        //--------------------------------------------------------------------------------------
        public static int GetNbOfOccurInList(List<string> _List, string strinToFind, bool strictFind)
        {
            int nbOfElementPart = 0;
            foreach (string item in _List)
            {
                //Si recherche stricte  
                if (strictFind)
                {
                    if (item.Equals(strinToFind)) nbOfElementPart++;
                }
                else
                {
                    if (item.Contains(strinToFind)) nbOfElementPart++;
                }
            }
            return nbOfElementPart;
        }
        //--------------------------------------------------------------------
        //Retourne la liste d'application correspondant à la stream
        //--------------------------------------------------------------------
        public static List<string> JsonGetListeAppOfStream(string stream, Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId)
        {
            List<string> _Appli = new List<string>();
            _Appli.Add("");
            foreach (KeyValuePair<string, QRSHubListFullJson> item in _InfosApplicationParAppId)
            {
                QRSHubListFullJson hubInfoApplication = item.Value;
                if (stream == "" || stream == hubInfoApplication.stream.name)
                {
                    _Appli.Add(hubInfoApplication.name);
                }
            }
            _Appli.Sort();
            return _Appli;
        }
        //---------------------------------------------------------------------------------------------
        //Retourne la descriptions JSON de l'application selectionnée dans la liste
        //---------------------------------------------------------------------------------------------
        public static List<QRSHubListFullJson> JsonGetListeAppliInfos(Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId, string selectedApplication, string selectedStream)
        {
            try
            {
                List<QRSHubListFullJson> _HubInfoAppliJson = new List<QRSHubListFullJson>();
                foreach (KeyValuePair<string, QRSHubListFullJson> item in _InfosApplicationParAppId)
                {
                    if (!selectedApplication.Equals(""))
                    {
                        //Si la Stream n'est pas déjà renseignée, on l'ajoute
                        if (selectedStream.Equals(""))
                        {
                            if (!selectedApplication.Equals("") && selectedApplication.Equals(item.Value.name) && !(_HubInfoAppliJson.Contains(item.Value)))
                            {
                                _HubInfoAppliJson.Add(item.Value);
                            }
                        }
                        else
                        {
                            if (item.Value.stream.name.Equals(selectedStream) && !selectedApplication.Equals("") && selectedApplication.Equals(item.Value.name) && !(_HubInfoAppliJson.Contains(item.Value)))
                            {
                                _HubInfoAppliJson.Add(item.Value);
                            }
                        }
                    }
                }
                return _HubInfoAppliJson;
            }
            catch (Exception)
            {
                throw;
            }
        }
        //---------------------------------------------------------------------------------------------
        //Retourne la liste de stream (fct serveur et utilisateur et application si précisée)
        //---------------------------------------------------------------------------------------------
        public static List<string> JsonGetListeStream(Dictionary<string, QRSHubListFullJson> _InfosApplicationParAppId, string selectedApplication)
        {
            List<string> _Stream = new List<string>();
            _Stream.Add("");
            foreach (KeyValuePair<string, QRSHubListFullJson> item in _InfosApplicationParAppId)
            {
                QRSHubListFullJson hubInfoApplication = item.Value;
                //Recherche stream de l'application si précisée
                if (selectedApplication.Equals("") || selectedApplication.Equals(hubInfoApplication.name.Replace("-(NP)", "")))
                {
                    //Si la Stream n'est pas déjà renseignée, on l'ajoute
                    if (!(_Stream.Contains(hubInfoApplication.stream.name)))
                    {
                        _Stream.Add(hubInfoApplication.stream.name);
                    }
                }
            }
            _Stream.Sort();
            return _Stream;
        }
        //--------------------------------------------------------
        //Livraison : déplacer fichier qvs vers serveur
        //--------------------------------------------------------
        public static void TransfereQVS(string sourceDirectory, string FileName, string destinationServer, string destinationDirectory)
        {
            try
            {
                //Création du chemin de destination
                string sourceFile = sourceDirectory + FileName;
                destinationServer = destinationServer.Replace("http://", "");
                string destinationFile = @"\\" + destinationDirectory.Replace("\"", "").Replace("C:", destinationServer) + @"\" + FileName;

                // Déplacer fichier
                System.IO.File.Move(sourceFile, destinationFile);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur lors du déplacement du QVF." + "\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        //--------------------------------------------------------
        //Livraison : déplacer fichier qvs vers serveur
        //--------------------------------------------------------
        public static String MoveQVF(string sourceDirectory, string sourceFileName, string targetDirectory, string targetFileName)
        {
            try
            {
                string sourceFile = sourceDirectory + sourceFileName;
                string targetFile = targetDirectory + targetFileName;
                // Déplacer fichier

                if (System.IO.File.Exists(sourceFile) && System.IO.Directory.Exists(targetDirectory))
                {
                    if (System.IO.File.Exists(targetFile)) System.IO.File.Delete(targetFile);
                    System.IO.File.Copy(sourceFile, targetFile);
                }
                else return "";

                return targetFile;
            }
            catch (Exception ex)
            {
                MessageErreur = "Erreur sur CopyQVS.\n" + ex.Message;
                throw;
            }
        }
        //--------------------------------------------------------------
        //Copie d'un fichier avec suppression de la cible si existe déjà
        //--------------------------------------------------------------
        public static String CopyFile(string sourceDirectory, string sourceFileName, string targetDirectory, string targetFileName)
        {
            try
            {
                string sourceFile = sourceDirectory + sourceFileName;
                string targetFile = targetDirectory + targetFileName;
                // Déplacer fichier
                if (System.IO.File.Exists(sourceFile) && System.IO.Directory.Exists(targetDirectory))
                {
                    if (System.IO.File.Exists(targetFile)) System.IO.File.Delete(targetFile);
                    System.IO.File.Copy(sourceFile, targetFile);
                }
                else return "";

                return targetFile;
            }
            catch (Exception ex)
            {
                MessageErreur = "Erreur sur CopyQVF.\n" + ex.Message;
                throw;
            }
        }
        //-----------------------------------------------------------
        //Teste l'existance d'un répertoire et le créer si nécessaire 
        //-----------------------------------------------------------
        public static void ExistOrCreate(string directory)
        {
            try
            {
                if (!System.IO.Directory.Exists(directory))
                {
                    System.IO.Directory.CreateDirectory(directory);
                }
            }
            catch (Exception ex)
            {
                MessageErreur = "Erreur sur ExistOrCreate : " + directory + " \n" + ex.Message;
                throw;
            }
        }
        //-----------------------------------------------------------------------------------------------------
        // Supprime les répertoire d'archivage présent dans qvfDirectory plus vieux de [nbJoursRetention] jours
        //-----------------------------------------------------------------------------------------------------
        public static void EpurationDirectory(string qvfDirectory, string suffixeArchiveDir, int nbJoursRetention)
        {
            string fullFileNameCatch = String.Empty;
            try
            {
                if (System.IO.Directory.Exists(qvfDirectory))
                {
                    Int64 numDateMin = Int64.Parse(DateTime.Now.AddDays(-nbJoursRetention).ToString("yyyyMMdd"));
                    //Récupère tous les noms de sous répertoire
                    IEnumerable<string> _fileName = System.IO.Directory.EnumerateDirectories(qvfDirectory, '*' + suffixeArchiveDir);
                    //Pour tous les sous répertoire
                    foreach (string fullFileName in _fileName)
                    {
                        fullFileNameCatch = String.Empty;
                        string fileName = fullFileName.Split('\\').Last();
                        //Récupère la date inclu dans le nom de fichier
                        Int64 numDate = Int64.Parse(fileName.Replace(suffixeArchiveDir, ""));
                        //si la date inclu est antécédente à la date de référence, répertoire à supprimer 
                        if (numDate < numDateMin)
                        {
                            fullFileNameCatch = fullFileName;
                            //Suppression des fichier du répertoire

                            //Suppression du répertoire
                            System.IO.Directory.Delete(fullFileName, true);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageErreur = "Erreur sur EpurationDirectory du répertoire : " + fullFileNameCatch + " \n" + ex.Message;
                throw;
            }
        }

        //--------------------------------------------------------
        //Livraison : supprimer fichier qvs 
        //--------------------------------------------------------
        public static bool DeleteQvfFile(string fullFileName)
        {
            try
            {
                if (System.IO.File.Exists(fullFileName)) System.IO.File.Delete(fullFileName);
                else return false;

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur lors de la suppression du fichier du QVF." + "\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }
        }
        //--------------------------------------------------------
        //Fichier : retourne la taille d'un fichier en Mo
        //--------------------------------------------------------
        public static FileAttributes GetFileInfos(string fullFileName)
        {
            try
            {
                FileAttributes fileAttributes = null; 
                
                System.IO.FileInfo oFile = new System.IO.FileInfo(fullFileName);
                if (oFile.Exists == true)
                {
                    fileAttributes = new FileAttributes();
                    fileAttributes.fileInfo = oFile;
                    //if (tmpFileSize != null) tmpFileSize = (Math.Round(oFile.Length / 1024 / 1024, 3, MidpointRounding.AwayFromZero)).ToString();
                    float tmpFileSize = oFile.Length;
                    fileAttributes.SizeMo = Math.Round((tmpFileSize / 1024 / 1024), 3, MidpointRounding.AwayFromZero);
                    
                }

                return fileAttributes;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur SizeOfFileMo." + "\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return null;
            }
        }

        //--------------------------------------------------------
        //Erreur : Afficher message d'erreur
        //--------------------------------------------------------
        public static bool DisplayError(string customMessage1, QlikEngineConnexion myQlik, QlikEngineConnexion myQlik_ALivrer, QlikEngineConnexion myQlik_Macro, Exception myException)
        {
            try
            {
                //Message passé en paramètre
                string message = "";
                if (!string.IsNullOrEmpty(customMessage1)) message += customMessage1 + "\n\n";
                //Messages liées aux erreurs des instances de connexion
                if (myQlik != null  && !string.IsNullOrEmpty(myQlik.MessageErreur)) message += "[Erreur connexion \"Source\" : Serveur d'origine]\n" + myQlik.MessageErreur + "\n\n";
                if (myQlik_ALivrer != null && !string.IsNullOrEmpty(myQlik_ALivrer.MessageErreur)) message += "[Erreur connexion \"Cible\" : Livraison application]\n" + myQlik_ALivrer.MessageErreur + "\n\n";
                if (myQlik_Macro != null && !string.IsNullOrEmpty(myQlik_Macro.MessageErreur)) message += "[Erreur connexion \"Cible\" : Livraison applications par lot]\n" + myQlik_Macro.MessageErreur + "\n\n";
                //Message liée aux erreurs d'utilitaires
                if (!string.IsNullOrEmpty(Utilitaires.MessageErreur)) message += "Erreur utilitaires :\n" + Utilitaires.MessageErreur + "\n\n";
                if (!string.IsNullOrEmpty(myException.Message)) message += "Exception levé - message :\n" + myException.Message + "\n\n";
                if (!string.IsNullOrEmpty(myException.StackTrace)) message += "Exception levé - pile d'appels :\n" + myException.StackTrace + "\n";

                MessageBox.Show(message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);

                if (myQlik != null) myQlik.MessageErreur = "";
                if (myQlik_ALivrer != null) myQlik_ALivrer.MessageErreur = "";
                if (myQlik_Macro != null) myQlik_Macro.MessageErreur = "";
                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur DiplayError." + "\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Utilitaires.MessageErreur = "";
                return false;
            }
        }
        //--------------------------------------------------------
        //Erreur : Afficher message d'erreur
        //--------------------------------------------------------
        public static bool DisplayMsg(string titre, string message)
        {
            try
            {

                MessageBox.Show(message, titre, MessageBoxButtons.OK, MessageBoxIcon.Error);

                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur DisplayMsg." + "\n" + ex.Message, "Erreur", MessageBoxButtons.OK, MessageBoxIcon.Error);
                throw;
            }
        }
        //--------------------------------------------------------
        //Liste les réperoitre d'un répertoire
        //--------------------------------------------------------
        public static List<string> GetListeRepertoire(string directory)
        {
            try
            {
                List<string> _directories = new List<string>();
                if (System.IO.Directory.Exists(directory))
                {
                    string[] _dir = System.IO.Directory.GetDirectories(directory);
                    //Parcours des fichiers du répertoire qvfDirectorie
                    foreach (string d in _dir)
                    {
                        //_directories.Add(System.IO.Path.GetDirectoryName(d));
                        _directories.Add(d.Replace(directory, ""));
                    }
                }

                return _directories;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur GetListeRepertoire.";
                throw;
            }
        }
        //----------------------------------------------------------------------------------------
        //Execution d'un batch
        //Exemple scriptFile = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe ";
        //----------------------------------------------------------------------------------------
        public static bool RunBatchScript(String scriptFile, Dictionary<string, string> _parameters)
        {
            try
            {
                int exitCode;
                ProcessStartInfo processInfo;
                Process process;
                string command = scriptFile;
                foreach (KeyValuePair<string, string> parameter in _parameters)
                {
                    //command += " -" + parameter.Key + " \"" + parameter.Value + "\" ";
                    //Pour ancienne version
                    //command += " /" + parameter.Key + ":" + parameter.Value + " ";
                    command += " " + parameter.Value + " ";
                }
                processInfo = new ProcessStartInfo("cmd.exe", "/c " + command);
                processInfo.CreateNoWindow = true;
                processInfo.UseShellExecute = false;
                // *** Redirect the output ***
                processInfo.RedirectStandardError = true;
                processInfo.RedirectStandardOutput = true;
                process = Process.Start(processInfo);
                process.WaitForExit();
                // *** Read the streams ***
                // Warning: This approach can lead to deadlocks, see Edit #2
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                exitCode = process.ExitCode;

                //if(!String.IsNullOrEmpty(output)) Console.WriteLine("---->Execution cmd:\n" + output);
                string commandDescription = scriptFile + " " + _parameters["command"];
                if (!String.IsNullOrEmpty(error)) Console.WriteLine("---->Erreur " + commandDescription + ": " + error);
                if(!String.IsNullOrEmpty(exitCode.ToString())) Console.WriteLine("---->Exit code "+ commandDescription + ": " + exitCode.ToString());
                
                process.Close();

                if (!String.IsNullOrEmpty(error)) return false;
                else return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur GetListeRepertoire.";
                throw;
            }
        }
        //----------------------------------------------------------------------------------------
        //Execution d'un script powershell
        //Exemple scriptFile = "C:\\QSData\\publish-script.ps1"
        //----------------------------------------------------------------------------------------
        public static bool RunScript(String scriptFile, List<string> parameters)
        {
            try
            {
                // Validate parameters
                if (string.IsNullOrEmpty(scriptFile)) { throw new ArgumentNullException("scriptFile"); }
                if (parameters == null) { throw new ArgumentNullException("parameters"); }
                RunspaceConfiguration runspaceConfiguration = RunspaceConfiguration.Create();
                using (Runspace runspace = RunspaceFactory.CreateRunspace(runspaceConfiguration))
                {
                    runspace.Open();
                    RunspaceInvoke scriptInvoker = new RunspaceInvoke(runspace);
                    //scriptInvoker.Invoke("Set-ExecutionPolicy RemoteSigned");
                    scriptInvoker.Invoke("Set-ExecutionPolicy RemoteSigned -Scope CurrentUser");

                    Pipeline pipeline = runspace.CreatePipeline();
                    Command scriptCommand = new Command(scriptFile);
                    Collection<CommandParameter> commandParameters = new Collection<CommandParameter>();
                    foreach (string scriptParameter in parameters)
                    {
                        CommandParameter commandParm = new CommandParameter(null, scriptParameter);
                        commandParameters.Add(commandParm);
                        scriptCommand.Parameters.Add(commandParm);
                    }
                    pipeline.Commands.Add(scriptCommand);
                    Collection<PSObject> psObjects;
                    psObjects = pipeline.Invoke();
                }
                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur RunScript.";
                throw;
            }
        }

        //----------------------------------------------------------------------------------------
        //Execution d'un script powershell
        //Exemple scriptFile = "C:\\QSData\\publish-script.ps1"
        //----------------------------------------------------------------------------------------
        public static bool RunPowershellScript(String scriptFile, Dictionary<string, string> _parameters)
        {
            try
            {
                // Validate parameters
                if (string.IsNullOrEmpty(scriptFile)) { throw new ArgumentNullException("scriptFile"); }
                if (_parameters == null) { throw new ArgumentNullException("parameters"); }

                // Pour ajouter le mode d'execution
                //RunspaceConfiguration runspaceConfiguration = RunspaceConfiguration.Create();
                //Runspace runspace = RunspaceFactory.CreateRunspace(runspaceConfiguration);
                //runspace.Open();
                //RunspaceInvoke scriptInvoker = new RunspaceInvoke(runspace);
                //scriptInvoker.Invoke("Set-ExecutionPolicy RemoteSigned -Scope CurrentUser");

                PowerShell ps = PowerShell.Create();
                //ps.Runspace = runspace;

                // Mode d'execution
                ps.AddScript("Set-ExecutionPolicy RemoteSigned"); // -Scope CurrentUser");
                ps.AddCommand(scriptFile);
                ps.AddParameters(_parameters);

                // Run the command
                foreach (PSObject result in ps.Invoke())
                {
                    Console.WriteLine("{0}", result);
                }
                ps.Commands.Clear();

                return true;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur RunPowershellScript.";
                throw;
            }
        }
        //----------------------------------------------------------------------------------------
        //Livrer Macro : Lecture du csv de paramétrage des macros
        //----------------------------------------------------------------------------------------
        public static List<Macro> GetListeMacro(string fullFileName)
        {
            try
            {
                //Liste de retour
                List<Macro> _macro = new List<Macro>();
                //Recupération du contenu du csv sans entete (1tab/colonne dans 1tab/ligne
                List<List<string>> _csv = CsvRead(fullFileName);
                List<MacApplication> _contenu = new List<MacApplication>();
                Macro macro = new Macro();

                MacApplication info = new MacApplication();

                string macroNameOld = String.Empty;
                foreach (var ligne in _csv)
                {
                    string csvMacroName = ligne[0];
                    //Si nom de macro vide passe ligne suivante
                    if (String.IsNullOrEmpty(csvMacroName)) continue;

                    //Nouvelle macro
                    if (csvMacroName != macroNameOld)
                    {
                        //Cas première ligne
                        if (!string.IsNullOrEmpty(macroNameOld))
                        {
                            //Ajout détail macro précédente
                            macro.contenu = _contenu;
                            //Ajoute la macro précédente dans la liste
                            _macro.Add(macro);
                        }
                        //Création nouvelle macro
                        macro = new Macro();
                        _contenu = new List<MacApplication>();
                        macro.name = csvMacroName;
                    }

                    //Ajout ligne détail à la macro
                    info = new MacApplication();
                    info.serveurSource = ligne[1]; //colonne n du csv
                    info.streamSource = ligne[2];
                    info.applicationSource = ligne[3];
                    info.serveurCible = ligne[4];
                    info.streamCible = ligne[5];
                    info.applicationCible = ligne[6];
                    _contenu.Add(info);

                    macroNameOld = csvMacroName;
                }

                //Ajout détail dernière macro
                if (!string.IsNullOrEmpty(macroNameOld))
                {
                    //Ajout détail macro précédente
                    macro.contenu = _contenu;
                    //Ajoute la macro précédente dans la liste
                    _macro.Add(macro);
                }

                //_macro.Sort();
                return _macro;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur GetListeMacro.";
                throw;
            }
        }
        //----------------------------------------------------------------------------------------
        //Livrer Macro : Epuration des macros paramétré
        //Garde que les macros ayant :
        //- les streamSource + applicationSource existants sur serveur source
        //- les streamCible + applicationCible existants sur serveur cibleLire 
        //----------------------------------------------------------------------------------------
        public static bool DetailMacroExist(Dictionary<string, QRSHubListFullJson> _applicationSource, Dictionary<string, QRSHubListFullJson> _applicationCible, MacApplication detailMacro)
        {
            //Par défaut la macro est incorrect
            bool retour = false;
            bool sourceOk = false;
            bool cibleOk = false;
            try
            {
                //Epuration sur application source
                foreach (var appliS in _applicationSource.Values)
                {
                    if (appliS.stream.name == detailMacro.streamSource && appliS.name == detailMacro.applicationSource)
                    {
                        //Ensemble source stream/application existe sur serveur source
                        sourceOk = true;
                        break;
                    }
                }

                //Si l'ensemble source stream/application existe sur le serveur source, teste la cible
                if (sourceOk)
                {
                    //Epuration sur application source
                    foreach (var appliC in _applicationCible.Values)
                    {
                        if (appliC.stream.name == detailMacro.streamCible && appliC.name == detailMacro.applicationCible)
                        {
                            //Ensemble cible stream/application existe sur serveur cible
                            cibleOk = true;
                            break;
                        }
                    }
                }
                retour = sourceOk && cibleOk;
                return retour;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur GetListeMacro.";
                throw;
            }
        }
        //----------------------------------------------------------------------------------------
        //Lire fichier csv : renvoi une liste ayant 1 ligne par élément
        //----------------------------------------------------------------------------------------
        public static List<List<string>> CsvRead(string fullFileName, bool withHeader = false)
        {
            try
            {
                //Liste de retour
                List<List<string>> _csv = new List<List<string>>();

                string ligne;
                Char caractere = ';';

                //Lecture du fichier avec gestion du cas ou déjà ouvert(FileShare.ReadWrite)
                using (FileStream stream = File.Open(fullFileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    using (StreamReader fichier = new StreamReader(stream, Encoding.UTF8))
                    {
                        while ((ligne = fichier.ReadLine()) != null)
                        {
                            List<string> _csvLigne = new List<string>();
                            String[] substrings = ligne.Split(caractere);

                            foreach (var substring in substrings)
                            {
                                _csvLigne.Add(substring);
                            }
                            _csv.Add(_csvLigne);
                        }
                        fichier.Close();
                    }
                }

                //dlt entete si pas demandé
                if (!withHeader) _csv.RemoveAt(0);
                return _csv;
            }
            catch (Exception)
            {
                MessageErreur = "Erreur CsvRead.";
                throw;
            }
        }
        //--------------------------------------------------------------
        //LIVRER Macro : Alimentation tableau
        //--------------------------------------------------------------
        public static void CreateColumn(DataGridView tab, int index, string libelle)
        {
            try
            {
                tab.Columns[index].Name = libelle;
                tab.Columns[index].Resizable = DataGridViewTriState.True;
                //tab.Columns[index].DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleLeft;
                tab.Columns[index].HeaderCell.Style.Alignment = DataGridViewContentAlignment.MiddleCenter;
                tab.Columns[index].DisplayIndex = index;
            }
            catch (Exception)
            {
                throw;
            }
        }
        //--------------------------------------------------------------
        //LIVRER Macro : Alimentation tableau
        //--------------------------------------------------------------
        public static void CreateColumnCheckbox(DataGridView tab, int index, string libelle, bool isChecked)
        {
            try
            {
                //Déclaration colonne CB
                DataGridViewCheckBoxColumn checkBoxColumn = new DataGridViewCheckBoxColumn();
                //Ajout de la colonne CB
                tab.Columns.Add(checkBoxColumn);
                //Paramétrage de la colonne
                CreateColumn(tab, index, libelle);
                //Cocher par défaut la CB de sélection
                if (isChecked)
                {
                    foreach (DataGridViewRow row in tab.Rows)
                    {
                        row.Cells[checkBoxColumn.Name].Value = true;
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        //--------------------------------------------------------------
        //Lecture fichier xls sans Excel (Dll ExcelDataReader)
        //--------------------------------------------------------------
        public static List<MAJDimMes> ReadXlsxFile(string filePath)
        {

            try
            {
                string sheetNameListToProcess = "Dimension;Mesure";
                List<MAJDimMes> _ObjetAtraiter = new List<MAJDimMes>();

                var package = new ExcelPackage(new FileInfo(filePath));

                //ExcelWorksheet workSheet = package.Workbook.Worksheets[1];

                foreach (ExcelWorksheet workSheet in package.Workbook.Worksheets)
                {
                    //Si on est sur l'onglet
                    string XlsSheetName = workSheet.Name.ToString();
                    if (sheetNameListToProcess.Contains(XlsSheetName))
                    {
                         
                        //Parcours les lignes
                        for (int i = workSheet.Dimension.Start.Row + 1; i <= workSheet.Dimension.End.Row; i++)
                        {
                            //Si le nom (= ligne) est valorisé dans xls, ajoute l'objet dans la liste
                            string tmpNom = GetCellValue(workSheet.Cells[i, 3]);
                            if (!String.IsNullOrEmpty(tmpNom))
                            {
                                //Ajouter différent de blanc
                                //modifier fichier excel (colonne et nom onglet)
                                
                                MAJDimMes objetAtraiter = new MAJDimMes();

                                objetAtraiter.nom = tmpNom;
                                objetAtraiter.nature = XlsSheetName;
                                objetAtraiter.xlsLine = i;

                                string tmpCategorie = GetCellValue(workSheet.Cells[i, 1]);
                                if (!String.IsNullOrEmpty(tmpCategorie)) objetAtraiter.categorie = tmpCategorie;

                                string tmpId = GetCellValue(workSheet.Cells[i, 2]);
                                if (!String.IsNullOrEmpty(tmpId)) objetAtraiter.id = tmpId;
                                
                                string tmpEtiquette = GetCellValue(workSheet.Cells[i, 4]);
                                if (!String.IsNullOrEmpty(tmpEtiquette)) objetAtraiter.etiquette = tmpEtiquette;

                                string tmpExpression = GetCellValue(workSheet.Cells[i, 5]);
                                if (!String.IsNullOrEmpty(tmpExpression))
                                {
                                    tmpExpression = tmpExpression.Replace("\n", "\\n");
                                    tmpExpression = tmpExpression.Replace("\"", "\\\"");
                                    objetAtraiter.expression = tmpExpression;
                                }
                                

                                string tmpDescription = GetCellValue(workSheet.Cells[i, 6]);
                                if (!String.IsNullOrEmpty(tmpDescription))
                                {
                                    tmpDescription = tmpDescription.Replace("\n", "\\n");
                                    tmpDescription = tmpDescription.Replace("\"", "\\\"");
                                    objetAtraiter.description = tmpDescription;
                                }

                                if (XlsSheetName.Equals("Dimension"))
                                {
                                    string tmpType = GetCellValue(workSheet.Cells[i, 7]);
                                    if (!String.IsNullOrEmpty(tmpType)) objetAtraiter.type = tmpType;
                                }

                                _ObjetAtraiter.Add(objetAtraiter);
                            }
                        }
                    }
                }
                return _ObjetAtraiter;
            }
            catch (Exception ex)
            {
                DisplayError("ReadXlsxFileEpplus en erreur.", null, null, null, ex);
                throw;
            }
        }
        //--------------------------------------------------------------
        //Renvoie la valeur de la cellule si différent de blanc ou vide
        //--------------------------------------------------------------
        public static string GetCellValue(ExcelRangeBase cellContent)
        {
            string cellValue = "";

            if (    (cellContent.Value != null) 
                    && (!String.IsNullOrEmpty(cellContent.Value.ToString().Trim())))
                cellValue = cellContent.Value.ToString().Trim();
                        
            return cellValue;
        }
        //--------------------------------------------------------------
        //Lecture fichier xls sans Excel (Dll ExcelDataReader)
        //--------------------------------------------------------------
        public static void UpdateXlsxFile(string filePath, List<MAJDimMes> _objets)
        {
            try
            {
                var package = new ExcelPackage(new FileInfo(filePath));
                
                //ExcelWorksheet workSheet = package.Workbook.Worksheets[1];

                foreach (ExcelWorksheet workSheet in package.Workbook.Worksheets)
                {
                    string xslSheetName = workSheet.Name.ToString();
                    int nbEcritureXlsSheet = 0;
                    //MAJ de l'ID des objets
                    foreach (MAJDimMes objet in _objets)
                    {
                        //Traite uniquement les objets d'une nature (dimension, mesure...) correspondant à l'onglet xls
                        if (objet.nature.Equals(xslSheetName))
                        {
                            
                            //id
                            nbEcritureXlsSheet += UpdCellValue(workSheet, objet.xlsLine, 2, objet.id);
                            //Nom (ne pas toucher provient du xls)
                            //etiquette
                            nbEcritureXlsSheet += UpdCellValue(workSheet, objet.xlsLine, 4, objet.etiquette);
                            //expression
                            nbEcritureXlsSheet += UpdCellValue(workSheet, objet.xlsLine, 5, objet.expression);
                            //description
                            nbEcritureXlsSheet += UpdCellValue(workSheet, objet.xlsLine, 6, objet.description);
                            //type
                            nbEcritureXlsSheet += UpdCellValue(workSheet, objet.xlsLine, 7, objet.type);
                        }
                    }
                    //Sauvegarde Excel
                    if (nbEcritureXlsSheet > 0)
                    {
                        int nb_tentative = 0;
                        bool nouvelEssai = true;
                        while(nouvelEssai)
                        {
                            try
                            {
                                nb_tentative++;
                                package.Save();
                                nouvelEssai = false;
                            }
                            catch (Exception ex)
                            {
                                MessageBox.Show("Erreur : Impossible d'enregistrer le fichier : " + filePath + 
                                                ".\nVérifiez que le fichier soit fermer.\nNombre d'essais restant : "+ (3-nb_tentative)+ 
                                                ".\n Original error: " + ex.Message);
                                if (nb_tentative >= 3) nouvelEssai = false;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                DisplayError("UpdateXlsxFile en erreur.", null, null, null, ex);
                throw;
            }
        }
        //------------------------------------------------------------------------------------------
        //Met à jour une cellule en testant la cellule et la nouvelle valeur et retourne si écriture
        //------------------------------------------------------------------------------------------
        public static int UpdCellValue(ExcelWorksheet workSheet, int row, int col, string value)
        {
            //Cellule du fichier Excel
            string cellValue = "";
            if (workSheet.Cells[row, col].Value != null) cellValue = workSheet.Cells[row, col].Value.ToString().Trim();

            //Chaine à écrire dans cellule
            if (value != null) value = value.ToString().Trim();

            //Ecriture si cellule xls vide et chaine non null et non vide
            if (String.IsNullOrEmpty(cellValue) && !String.IsNullOrEmpty(value))
            {
                workSheet.Cells[row, col].Value = value;
                return 1;
            }
                           
            return 0;
        }

        //-------------------------------------------------------------------------------------------
        // Recherche et retourne une collection de certificat
        //-------------------------------------------------------------------------------------------
        public static X509Certificate2Collection GetCertificate(string host)
        {
            X509Certificate2Collection certificateCollection = new X509Certificate2Collection();
            string NomConvivial = "";
            // First locate the Qlik Sense client certificate
            X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
            store.Open(OpenFlags.ReadOnly);
            //Nom convivial du certificat selon le seveur 
            if (host.Contains("99")) NomConvivial = "Qlik-dev";
            else NomConvivial = "Qlik-prod";

            certificateCollection = new X509Certificate2Collection();
            foreach (X509Certificate2 certificate in store.Certificates)
            {
                if (certificate.FriendlyName == NomConvivial) certificateCollection.Add(certificate);
            }
            

            store.Close();
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            return certificateCollection;

        }
        //-------------------------------------------------------------------------------------------
        // Recherche et retourne une collection de certificat
        //-------------------------------------------------------------------------------------------
        public static bool GetIsServerLocalConnection(string host, Dictionary<string, string> _parametrage)
        {
            bool isLocalConnection = false;

            //Si on est sur un serveur
            if (Environment.MachineName.Contains("SRV"))
            {
                //Si l'url du serveur est configuré
                if (_parametrage.ContainsKey(Environment.MachineName))
                { 
                    //Si l'url du serveur local = l'url serveur séléctionné
                    if (_parametrage[Environment.MachineName] == host )
                    {
                        isLocalConnection = true;
                    }
                }
            }
            return isLocalConnection;
        }

        //-----------------------------------------------------------------------------------------
        // Ajoute la structure de l'application dans la description
        //-----------------------------------------------------------------------------------------
        public static object GetGenericObjectList(IApp application, string nature)
        {
            bool isDimensions, isMeasures, isVariables, isFields, isListbox = false;
            isDimensions = nature.Equals("dimensions");
            isMeasures = nature.Equals("measures");
            isVariables = nature.Equals("variables");
            isFields = nature.Equals("fields");
            isListbox = nature.Equals("listbox");
            
            List<Object> _object = new List<object>();

            if (isDimensions)
            {
                List<IDimension> _dimensions = new List<IDimension>();
                var layout = application.GetDimensionList().GetLayout();
                var _items = layout.As<DimensionListLayout>().DimensionList.Items;
                foreach (var item in _items)
                {
                    _dimensions.Add(application.GetDimension(item.Info.Id));
                }
                return _dimensions;
            }
            else if (isMeasures)
            {
                List<IMeasure> _measures = new List<IMeasure>();
                var layout = application.GetMeasureList().GetLayout();
                var _items = layout.As<MeasureListLayout>().MeasureList.Items;
                foreach (var item in _items)
                {
                    _measures.Add(application.GetMeasure(item.Info.Id));
                }
                return _measures;
            }
            else if (isVariables)
            {
                List<GenericVariable> _variables = new List<GenericVariable>();
                var layout = application.GetVariableList().GetLayout();
                var _items = layout.As<VariableListLayout>().VariableList.Items;
                foreach (var item in _items)
                {
                    _variables.Add(application.GetVariableById(item.Info.Id));
                }
                return _variables;
            }
            else if (isFields)
            {
                List<IField> _fields = new List<IField>();
                var layout = application.GetFieldList().GetLayout();
                var _items = layout.As<FieldListLayout>().FieldList.Items;
                foreach (var item in _items)
                {
                    _fields.Add(application.GetField(item.Name));
                }
                return _fields;
            }
            else if (isListbox)
            {
                //List<IListbox> _listbox = new List<IListbox>();
                //app.GetObject<Listbox>(childId)
                //var layout = application.GetFieldList().GetLayout();
                /*NxGetObjectOptions option = new NxGetObjectOptions();
                option.Types = new List<String>(new string[] { "ListBox" });
                var layout = application.GetObjects(option);*/

                List<IListbox> _listbox = application.GetAllInfos().Select(listbox => application.GetObject<GenericObject>(listbox.Id)).OfType<IListbox>().ToList();
                return _listbox;
            }
            else {
                return null;
            }

        }
        //-----------------------------------------------------------------------------------------
        // Met en forme une données à stocker dans une colonne csv
        //-----------------------------------------------------------------------------------------
        public static string CsvPrepareData(string data)
        {
            string dataReady = "";

            if(string.IsNullOrEmpty(data)) dataReady = "\"\";";
            else dataReady = "\"" + data.Replace("\"", "\"\"") + "\";";

            return dataReady;
        }
        //-----------------------------------------------------------------------------------------
        // Renvoi une chaine de caractere mettant en forme les 2 chaines passées en paramètre
        //-----------------------------------------------------------------------------------------
        public static string WriteDescriptionAndLabel(string description, string label)
        {
            string delimiterDesc = "#";
            string delimiterLabel = " @";

            string chaineFinale = delimiterDesc + description + delimiterDesc + delimiterLabel + label + delimiterLabel;

            return chaineFinale;
        }

        //------------------------------------------------------------------------------------------
        // Renvoi l'objet passé en paramètre, complété par les dimensions et les mesures
        //------------------------------------------------------------------------------------------
        public static ExportModeleObject ExportModeleApplicationAddInfos(MyAppStructure structureApp, ExportModeleObject objet)
        {
            //Ecriture colonnes csv
            string strDim = "";
            string strMes = "";
            string joinSeparator = "/";

            //FILTERPANE
            if (objet.objectType == "filterpane")
            {
                //Récupère les listbox
                var _FilterPaneListBox = objet.json.Layout.Get<FilterpaneListboxObjectViewList>("qChildList").Items;

                //Pour chaque listbox
                foreach (var filterPaneListBox in _FilterPaneListBox)
                {
                    //Lister les dimensions de chaque listbox
                    foreach (var listBox in structureApp.getListboxList.Where(item => item.Id == filterPaneListBox.Info.Id))
                    {
                        if (strDim != "") strDim += ';';
                        var _dim = listBox.Layout.Get<ListboxListObject>("qListObject").DimensionInfo.GroupFieldDefs;
                        strDim = WriteDescriptionAndLabel(
                                                             string.Join(joinSeparator, _dim.ToArray()),
                                                             string.Join(joinSeparator, listBox.Layout.Get<ListboxListObject>("qListObject").DimensionInfo.FallbackTitle)
                                                            );
                    }
                }
            }

            //KPI
            else if (objet.objectType == "kpi")
            {
                //Dimensions
                List<NxDimension> _dim = objet.objectHyperCubeDef.Dimensions.ToList();
                if (strDim != "") strDim += ';';
                foreach (var dim in _dim)
                {
                    //if (!String.IsNullOrEmpty(dim.LibraryId))
                    if (dim.Def.FieldDefs.ToArray().Count() < 1)
                    {
                        var _dimension = structureApp.getDimensionList.Where(item => item.Id == dim.LibraryId);
                        //Si la mesure existe
                        if (_dimension.Count() > 0)
                        {
                            var dimension = _dimension.First();
                            strDim = WriteDescriptionAndLabel(
                                                            string.Join(joinSeparator, dimension.Properties.Dim.FieldDefs.ToArray()),
                                                            string.Join(joinSeparator, dimension.Properties.Dim.FieldLabels.ToArray())
                                                            );
                        }
                        else strMes = WriteDescriptionAndLabel("Erreur mesure inexistante", "Erreur");
                    }
                    else strDim = WriteDescriptionAndLabel(string.Join(joinSeparator, dim.Def.FieldDefs.ToArray()), dim.Def.LabelExpression);
                }

                //Mesures
                List<NxMeasure> _meas = objet.objectHyperCubeDef.Measures.ToList();
                foreach (var meas in _meas)
                {
                    if (strMes != "") strDim += ';';
                    if (meas.Def.Expressions.ToArray().Count() < 1)
                    {
                        if (meas.LibraryId != null)
                        {
                            var _measure = structureApp.getMeasureList.Where(item => item.Id == meas.LibraryId);
                            //Si la mesure existe
                            if (_measure.Count() > 0)
                            {
                                var measure = _measure.First();
                                
                                string descTmp = string.Join(joinSeparator, measure.Properties.Measure.Expressions.ToArray());
                                if (measure.Properties.Measure.Def != "")
                                {
                                    if (descTmp != "") descTmp += ";";
                                    descTmp += measure.Properties.Measure.Def;
                                };
                                strMes = WriteDescriptionAndLabel(
                                                                descTmp,
                                                                string.Join(joinSeparator, measure.Properties.Measure.LabelExpression)
                                                                );
                            }
                            else strMes = WriteDescriptionAndLabel("Erreur mesure inexistante", "Erreur");
                        }
                        else strMes = WriteDescriptionAndLabel(string.Join(joinSeparator, meas.Def.Def), "");
                    }
                    else strMes = WriteDescriptionAndLabel(string.Join(joinSeparator, meas.Def.Expressions.ToArray()), meas.Def.LabelExpression);
                }
            }

            //AUTRES TYPES OBJET
            else if (objet.objectHyperCubeDef != null)
            {
                //Dimensions
                IEnumerable<NxDimension> _dim = objet.objectHyperCubeDef.Dimensions;
                foreach (var dim in _dim)
                {
                    //if (!String.IsNullOrEmpty(dim.LibraryId))
                    if (dim.Def.FieldDefs.ToArray().Count() < 1)
                    {
                        var _dimension = structureApp.getDimensionList.Where(item => item.Id == dim.LibraryId);
                        //Si la mesure existe
                        if (_dimension.Count() > 0)
                        {
                            var dimension = _dimension.First();
                            strDim = WriteDescriptionAndLabel(
                                                                string.Join(joinSeparator, dimension.Properties.Dim.FieldDefs.ToArray()),
                                                                string.Join(joinSeparator, dimension.Properties.Dim.FieldLabels.ToArray())
                                                                );
                        }
                        else strMes = WriteDescriptionAndLabel("Erreur dimension inexistante", "Erreur");
                    }
                    else strDim = WriteDescriptionAndLabel(string.Join(joinSeparator, dim.Def.FieldDefs.ToArray()), dim.Def.LabelExpression);
                }

                //Mesures
                IEnumerable<NxMeasure> _mes = objet.objectHyperCubeDef.Measures;
                foreach (var meas in _mes)
                {
                    if (meas.Def.Expressions.ToArray().Count() < 1)
                    {
                        if (meas.LibraryId != null)
                        {
                            var _measure = structureApp.getMeasureList.Where(item => item.Id == meas.LibraryId);
                            //Si la mesure existe
                            if (_measure.Count() > 0)
                            {
                                var measure = structureApp.getMeasureList.Where(item => item.Id == meas.LibraryId).First();

                                string descTmp = string.Join(joinSeparator, measure.Properties.Measure.Expressions.ToArray());
                                if (measure.Properties.Measure.Def != "")
                                {
                                    if (descTmp != "") descTmp += ";";
                                    descTmp += measure.Properties.Measure.Def;
                                };
                                strMes = WriteDescriptionAndLabel(
                                                                descTmp,
                                                                string.Join(joinSeparator, measure.Properties.Measure.LabelExpression)
                                                                );
                            }
                            else strMes = WriteDescriptionAndLabel("Erreur mesure inexistante", "Erreur");
                        }
                        else strMes = WriteDescriptionAndLabel(string.Join(joinSeparator, meas.Def.Def), "");
                    }
                    else strMes = WriteDescriptionAndLabel(string.Join(joinSeparator, meas.Def.Expressions.ToArray()), meas.Def.LabelExpression);
                }
            }
            objet.mesures = strMes;
            objet.dimensions = strDim;
            return objet;
        }

        //------------------------------------------------------------------------------------------
        // Renvoi une liste d'ID des objet de reférence en différence
        //------------------------------------------------------------------------------------------
        public static Dictionary<string,string> CompareModelApplication(ExportModeleApp csvModelAppRef, ExportModeleApp csvModelAppComp)
        {
            bool isIdentic = true;
            Dictionary<string,string> _diff = new Dictionary<string,string>();

            //foreach (var refSheet in csvModelAppRef._sheet)
            foreach (var refSheet in csvModelAppRef._sheet.Where(s => !s.sheetType.Contains("Mes feuilles") && !s.sheetType.Contains("Communauté")))
            {
                foreach (var refObj in refSheet._object)
                {
                    //Récupère la feuille à comparer
                    var _compSheet = csvModelAppComp._sheet.Where(sheet => sheet.sheetId == refSheet.sheetId);
                    //Feuille non trouvée (via l'ID)
                    if (_compSheet.Count() < 1) isIdentic = false;
                    else
                    {
                        var compSheet = _compSheet.First();
                        //Titre feuille différent
                        if (refSheet.sheetTitle != compSheet.sheetTitle) isIdentic = false;
                        else
                        {
                            //Récupère l'objet à comparer
                            var _compObj = compSheet._object.Where(obj => obj.objectId == refObj.objectId);
                            //Objet non trouvée (via l'ID)
                            if (_compObj.Count() < 1) isIdentic = false;
                            else
                            {
                                var compObj = _compObj.First();
                                //Titre objet différent
                                if (refObj.objectTitle != compObj.objectTitle) isIdentic = false;
                                else
                                {
                                    //Mesures ou dimensions différentes
                                    if ((refObj.mesures != compObj.mesures) || (refObj.dimensions != compObj.dimensions)) isIdentic = false;
                                }
                            }
                        }
                    }
                    //Alimente liste des objets en différence
                    if (!isIdentic) _diff.Add( refObj.objectId, csvModelAppRef.appId );
                    isIdentic = true;
                }
            }
            return _diff;
        }
        //-----------------------------------------------------------------------------------------------------
        // Supprime les répertoire d'archivage présent dans qvfDirectory plus vieux de [nbJoursRetention] jours
        //-----------------------------------------------------------------------------------------------------
        public static List<FileAttributes> GetFileOfDirectory(string directory, string suffixeFile)
        {
            string fullFileNameCatch = String.Empty;
            List<FileAttributes> _fileAttributes = new List<FileAttributes>();
            try
            {
                if (System.IO.Directory.Exists(directory))
                {
                    //Récupère tous les noms de sous répertoire
                    IEnumerable<string> _fileName = System.IO.Directory.EnumerateFiles(directory);
                    //Pour tous les sous répertoire
                    foreach (string fullFileName in _fileName)
                        if (fullFileName.Contains(suffixeFile)) _fileAttributes.Add(GetFileInfos(fullFileName));
                }
                return _fileAttributes;
            }
            catch (Exception ex)
            {
                MessageErreur = "Erreur sur GetFileOfDirectory du répertoire : " + fullFileNameCatch + " \n" + ex.Message;
                throw;
            }
        }
    }
}
