using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.Models.EmploiDuTemps;
using BackendCoursFlow.Models.Salles;

namespace BackendCoursFlow.Donnees;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    // Utilisateurs
    public DbSet<Utilisateur> Utilisateurs { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Responsable> Responsables { get; set; }
    public DbSet<Professeur> Professeurs { get; set; }
    public DbSet<Etudiant> Etudiants { get; set; }
    
    // Pédagogie
    public DbSet<Filiere> Filieres { get; set; }
    public DbSet<Classe> Classes { get; set; }
    public DbSet<Matiere> Matieres { get; set; }
    public DbSet<PreRequis> PreRequis { get; set; }
    public DbSet<Cours> Cours { get; set; }
    
    // Salles
    public DbSet<Salle> Salles { get; set; }
    public DbSet<DisponibiliteSalle> DisponibilitesSalles { get; set; }
    
    // Emploi du temps
    public DbSet<Disponibilite> Disponibilites { get; set; }
    public DbSet<EmploiDuTemps> EmploisDuTemps { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuration des relations
        modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Admin)
            .WithOne(a => a.Utilisateur)
            .HasForeignKey<Admin>(a => a.UtilisateurId);
            
        modelBuilder.Entity<Cours>()
            .HasOne(c => c.Professeur)
            .WithMany(p => p.Cours)
            .HasForeignKey(c => c.ProfesseurId);

        modelBuilder.Entity<Utilisateur>()
            .HasOne(u => u.Admin)
            .WithOne(a => a.Utilisateur)
            .HasForeignKey<Admin>(a => a
            .HasIndex(m => m.Code)
            .IsUnique();
    }
}