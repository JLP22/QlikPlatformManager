using QlikPlatformManager.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace QlikPlatformManager.DAL
{
    public class QPMContext : DbContext
    {
        ////"QPMContext" = nom chaîne de connexion (ou à ajouter au fichier Web.config, ou si vide prend classe)
        //public QPMContext() : base("QPMContext")
        //{
        //}

        //Tables
        public DbSet<Historique> Historiques { get; set; }
        public DbSet<Serveur> Serveurs { get; set; }
        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //Mis en commentaire pour éviter de nommer les tables au singulier
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}