using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Models.Utilisateurs; 
using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.Models.Salles;
using BackendCoursFlow.Models.Enums;
using BackendCoursFlow.Models.EmploiDuTemps;
using System.ComponentModel.DataAnnotations;

namespace BackendCoursFlow.Donnees;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Utilisateur> Utilisateurs { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Responsable> Responsables { get; set; }
    public DbSet<Professeur> Professeurs { get; set; }
    public DbSet<Etudiant> Etudiants { get; set; }
    public DbSet<Filiere> Filieres { get; set; }
    public DbSet<Classe> Classes { get; set; }
    public DbSet<Matiere> Matieres { get; set; }
    public DbSet<PreRequis> PreRequis { get; set; }
    public DbSet<Cours> Cours { get; set; }
    public DbSet<Salle> Salles { get; set; }
    public DbSet<Disponibilite> Disponibilites { get; set; }
    public DbSet<DisponibiliteSalle> DisponibilitesSalles { get; set; }

    public DbSet<EmploiDuTemps> EmploisDuTemps { get; set; }

    public DbSet<AnneeUniversitaire> AnneesUniversitaires { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuration des relations Utilisateur - Roles
        modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Admin)
            .WithOne(a => a.Utilisateur)
            .HasForeignKey<Admin>(a => a.UtilisateurId);
            
        modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Responsable)
            .WithOne(r => r.Utilisateur)
            .HasForeignKey<Responsable>(r => r.UtilisateurId);
            
        modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Professeur)
            .WithOne(p => p.Utilisateur)
            .HasForeignKey<Professeur>(p => p.UtilisateurId);
            
        modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Etudiant)
            .WithOne(e => e.Utilisateur)
            .HasForeignKey<Etudiant>(e => e.UtilisateurId);
        
        // Configuration PreRequis
        modelBuilder.Entity<PreRequis>()
            .HasOne(pr => pr.Matiere)
            .WithMany(m => m.PreRequis)
            .HasForeignKey(pr => pr.MatiereId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<PreRequis>()
            .HasOne(pr => pr.MatierePrerequis)
            .WithMany(m => m.PreRequisPour)
            .HasForeignKey(pr => pr.MatierePrerequisId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Index pour optimiser les recherches
        modelBuilder.Entity<Utilisateur>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        modelBuilder.Entity<Etudiant>()
            .HasIndex(e => e.Matricule)
            .IsUnique();
            
        modelBuilder.Entity<Matiere>()
            .HasIndex(m => m.Code)
            .IsUnique();
    }
}