using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.Enums;

namespace BackendCoursFlow.Services.Utilisateurs;

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
            .ToListAsync();

        return professeurs.Select(p => new UtilisateurDTO
        {
            Id = p.Id,
            Nom = p.Nom,
            Prenom = p.Prenom,
            Email = p.Email,
            Telephone = p.Telephone,
            Role = "Professeur",
            IsActive = p.IsActive
        }).ToList();
    }

    // Récupérer les détails d'un prof 
    public async Task<Professeur?> GetProfesseurDetailsAsync(int id)
    {
        return await _context.Professeurs
            .Include(p => p.Disponibilites)
            .Include(p => p.Cours)
                .ThenInclude(c => c.Matiere)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    // Ajout 
    public async Task CreateProfesseurWithDtoAsync(CreateUtilisateurRequest userRequest, string grade, string specialite)
    {
        var nouveauProf = new Professeur
        {
            Nom = userRequest.Nom,
            Prenom = userRequest.Prenom,
            Email = userRequest.Email,
            MotDePasse = userRequest.Password,
            Telephone = userRequest.Telephone,
            Role = Role.Professeur,
            IsActive = true,
            Grade = grade,
            Specialite = specialite
        };

        _context.Professeurs.Add(nouveauProf);
        await _context.SaveChangesAsync();
    }

    // Mise à jour
    public async Task UpdateProfesseurAsync(int idProf, UpdateUtilisateurRequest updateRequest, string? grade, string? specialite)
    {
        var prof = await _context.Professeurs.FirstOrDefaultAsync(p => p.Id == idProf);

        if (prof != null)
        {
            // Mise à jour des infos utilisateur (héritées)
            if (updateRequest.Nom != null) prof.Nom = updateRequest.Nom;
            if (updateRequest.Prenom != null) prof.Prenom = updateRequest.Prenom;
            if (updateRequest.Telephone != null) prof.Telephone = updateRequest.Telephone;
            if (updateRequest.IsActive != null) prof.IsActive = updateRequest.IsActive.Value;

            // Mise à jour des infos spécifiques au prof
            if (grade != null) prof.Grade = grade;
            if (specialite != null) prof.Specialite = specialite;

            await _context.SaveChangesAsync();
        }
    }
}