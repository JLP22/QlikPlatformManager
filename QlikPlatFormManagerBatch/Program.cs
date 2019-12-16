
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QlikPlatFormManagerBatch
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                if (args.Length > 0)
                {
                    Console.WriteLine("QlikPlateformManagerBatch : Début");

                    // Command line given, display console 
                    AllocConsole();
                    //ConsoleMain(args);
                    Batch MyQlikBatch = new Batch();
                    //Paramètre pour desktop en mode debug : "archiver" "Mon travail" "C:\QlikArchivageApplications" "10"
                    MyQlikBatch.Lancer(args);
                    //Console.ReadLine();
                }
                else
                {
                    Console.WriteLine("QlikPlateformManagerBatch : Aucun paramètre");
                    //Console.ReadKey();
                }
                Console.WriteLine("QlikPlateformManagerBatch : Fin ");
            }
            catch (Exception e) {
                Console.WriteLine("/!\\ QlikPlateformManagerBatch : Erreur d'execution :\n" + e.Message);
                Console.WriteLine("/!\\ QlikPlateformManagerBatch : Fin ");
            }
        }
        [System.Runtime.InteropServices.DllImport("kernel32.dll")]
        private static extern bool AllocConsole();
    }
}
