namespace BackendCoursFlow.Services.Utilisateurs;

using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.Enums;

public class ProfesseurService
{
    private readonly ApplicationDbContext _context;

    public ProfesseurService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Récupérer tous les professeurs
    public async Task<List<UtilisateurDTO>> GetAllProfesseursAsync()
    {
        var professeurs = await _context.Professeurs
            .Include(p => p.Utilisateur)
            .ToListAsync();

        return professeurs.Select(p => new UtilisateurDTO
        {
            Id = p.IdProf,
            Nom = p.Utilisateur?.Nom ?? string.Empty,
            Prenom = p.Utilisateur?.Prenom ?? string.Empty,
            Email = p.Utilisateur?.Email ?? string.Empty,
            Telephone = p.Utilisateur?.Telephone,
            Role = "Professeur",
            IsActive = p.Utilisateur?.IsActive ?? true
        }).ToList();
    }

    // Récupérer les détails d'un prof 
    public async Task<Professeur?> GetProfesseurDetailsAsync(int id)
    {
        return await _context.Professeurs
            .Include(p => p.Utilisateur)
            .Include(p => p.Disponibilites)
            .Include(p => p.Cours)
                .ThenInclude(c => c.Matiere)
            .FirstOrDefaultAsync(p => p.IdProf == id);
    }

    // Ajout 
    public async Task CreateProfesseurWithDtoAsync(CreateUtilisateurRequest userRequest, string grade, string specialite)
    {
        // Création de l'utilisateur de base
        var nouvelUtilisateur = new Utilisateur
        {
            Nom = userRequest.Nom,
            Prenom = userRequest.Prenom,
            Email = userRequest.Email,
            Password = userRequest.Password,
            Telephone = userRequest.Telephone,
            Role = RoleUtilisateur.Professeur,
            IsActive = true
        };

        _context.Utilisateurs.Add(nouvelUtilisateur);
        await _context.SaveChangesAsync();

        // Création du professeur
        var nouveauProf = new Professeur
        {
            UtilisateurId = nouvelUtilisateur.Id,
            Grade = grade,
            Specialite = specialite
        };

        _context.Professeurs.Add(nouveauProf);
        await _context.SaveChangesAsync();
    }

    // Mise à jour
    public async Task UpdateProfesseurAsync(int idProf, UpdateUtilisateurRequest updateRequest, string? grade, string? specialite)
    {
        var prof = await _context.Professeurs.Include(p => p.Utilisateur).FirstOrDefaultAsync(p => p.IdProf == idProf);

        if (prof != null && prof.Utilisateur != null)
        {
            // Mise à jour des infos utilisateur
            if (updateRequest.Nom != null) prof.Utilisateur.Nom = updateRequest.Nom;
            if (updateRequest.Prenom != null) prof.Utilisateur.Prenom = updateRequest.Prenom;
            if (updateRequest.Telephone != null) prof.Utilisateur.Telephone = updateRequest.Telephone;
            if (updateRequest.IsActive != null) prof.Utilisateur.IsActive = updateRequest.IsActive.Value;

            // Mise à jour des infos spécifiques au prof
            if (grade != null) prof.Grade = grade;
            if (specialite != null) prof.Specialite = specialite;

            await _context.SaveChangesAsync();
        }
    }
}