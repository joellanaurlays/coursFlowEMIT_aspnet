namespace BackendCoursFlow.Services.Utilisateurs;

using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.Enums; 

public class EtudiantService
{
    private readonly ApplicationDbContext _context;

    public EtudiantService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Récupérer tous les étudiants
    public async Task<List<UtilisateurDTO>> GetAllEtudiantsAsync()
    {
        var etudiants = await _context.Etudiants
            .Include(e => e.Filiere)
            .Include(e => e.Classe)
            .Include(e => e.Utilisateur)
            .ToListAsync();

        return etudiants.Select(e => new UtilisateurDTO
        {
            Id = e.IdEtudiant, // ID fonctionnel de l'étudiant
            Nom = e.Utilisateur?.Nom ?? string.Empty,
            Prenom = e.Utilisateur?.Prenom ?? string.Empty,
            Email = e.Utilisateur?.Email ?? string.Empty,
            Telephone = e.Utilisateur?.Telephone,
            Role = "Etudiant",
            IsActive = e.Utilisateur?.IsActive ?? true
        }).ToList();
    }

    // Récupérer un étudiant par son ID 
    public async Task<UtilisateurDTO?> GetEtudiantByIdAsync(int id)
    {
        var e = await _context.Etudiants
            .Include(e => e.Filiere)
            .Include(e => e.Classe)
            .Include(e => e.Utilisateur)
            .FirstOrDefaultAsync(e => e.IdEtudiant == id);

        if (e == null) return null;

        return new UtilisateurDTO
        {
            Id = e.IdEtudiant,
            Nom = e.Utilisateur?.Nom ?? string.Empty,
            Prenom = e.Utilisateur?.Prenom ?? string.Empty,
            Email = e.Utilisateur?.Email ?? string.Empty,
            Telephone = e.Utilisateur?.Telephone,
            Role = "Etudiant",
            IsActive = e.Utilisateur?.IsActive ?? true
        };
    }

    // Ajout l'Utilisateur ET de l'Etudiant
    public async Task CreateEtudiantWithDtoAsync(CreateUtilisateurRequest userRequest, string matricule, string niveau, string? groupe, int idFiliere, int idClasse)
    {
        // Création de l'entité de base Utilisateur
        var nouvelUtilisateur = new Utilisateur
        {
            Nom = userRequest.Nom,
            Prenom = userRequest.Prenom,
            Email = userRequest.Email,
            Password = userRequest.Password, 
            Telephone = userRequest.Telephone,
            Role = RoleUtilisateur.Etudiant, 
            IsActive = true
        };

        _context.Utilisateurs.Add(nouvelUtilisateur);
        await _context.SaveChangesAsync(); // Sauvegarde pour générer l'Id de l'utilisateur

        // Création de l'entité Etudiant
        var nouvelEtudiant = new Etudiant
        {
            UtilisateurId = nouvelUtilisateur.Id, 
            Matricule = matricule,
            Niveau = niveau,
            Groupe = groupe,
            IdFiliere = idFiliere,
            IdClasse = idClasse
        };

        _context.Etudiants.Add(nouvelEtudiant);
        await _context.SaveChangesAsync();
    }

    // Suppression
    public async Task DeleteEtudiantAsync(int id)
    {
        var etudiant = await _context.Etudiants.Include(e => e.Utilisateur).FirstOrDefaultAsync(e => e.IdEtudiant == id);
        if (etudiant != null)
        {
            // Suppression de k'etu + compte utilisateur associé
            if (etudiant.Utilisateur != null)
            {
                _context.Utilisateurs.Remove(etudiant.Utilisateur);
            }
            _context.Etudiants.Remove(etudiant);
            await _context.SaveChangesAsync();
        }
    }
}