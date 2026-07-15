using BackendCoursFlow.DTOs;
using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.Enums;

namespace BackendCoursFlow.Services.Utilisateurs;

public interface IUtilisateurService
{
    Task<List<UtilisateurDTO>> GetAllUtilisateurs();

    Task<UtilisateurDTO?> GetUtilisateurById(int id);

    Task<UtilisateurDTO> CreateUtilisateur(CreateUtilisateurRequest request);

    Task<bool> UpdateUtilisateur(int id, UpdateUtilisateurRequest request);

    Task<bool> DeleteUtilisateur(int id);

    Task<List<UtilisateurDTO>> GetUtilisateursByRole(string role);

    // ETUDIANTS
    Task<List<UtilisateurDTO>> GetAllEtudiantsAsync();

    Task<UtilisateurDTO?> GetEtudiantByIdAsync(int id);

    Task CreateEtudiantWithDtoAsync(
        CreateUtilisateurRequest request,
        string matricule,
        string niveau,
        string? groupe,
        int idFiliere,
        int idClasse
    );

    Task<bool> DeleteEtudiantAsync(int id);    
}

public class UtilisateurService : IUtilisateurService
{
    private readonly ApplicationDbContext _context;
    
    public UtilisateurService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<UtilisateurDTO>> GetAllUtilisateurs()
    {
        var utilisateurs = await _context.Utilisateurs.ToListAsync();
        return utilisateurs.Select(MapToDTO).ToList();
    }
    
    public async Task<UtilisateurDTO?> GetUtilisateurById(int id)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);
        return utilisateur != null ? MapToDTO(utilisateur) : null;
    }
    
    public async Task<UtilisateurDTO> CreateUtilisateur(CreateUtilisateurRequest request)
    {
        var role = Enum.Parse<Role>(request.Role, true);

        Utilisateur utilisateur = role switch
        {
            Role.Admin => new Utilisateur
            {
                Nom = request.Nom,
                Prenom = request.Prenom,
                Email = request.Email,
                MotDePasse = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Telephone = request.Telephone,
                Role = role,
                IsActive = true
            },
            Role.Responsable => new Responsable
            {
                Nom = request.Nom,
                Prenom = request.Prenom,
                Email = request.Email,
                MotDePasse = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Telephone = request.Telephone,
                Role = role,
                IsActive = true
            },
            Role.Professeur => new Professeur
            {
                Nom = request.Nom,
                Prenom = request.Prenom,
                Email = request.Email,
                MotDePasse = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Telephone = request.Telephone,
                Role = role,
                IsActive = true
            },
            Role.Etudiant => new Etudiant
            {
                Nom = request.Nom,
                Prenom = request.Prenom,
                Email = request.Email,
                MotDePasse = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Telephone = request.Telephone,
                Role = role,
                IsActive = true
            },
            _ => throw new ArgumentException("Rôle invalide", nameof(request.Role))
        };

        if (utilisateur.Role == Role.Admin)
        {
            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();
            _context.Admins.Add(new Admin { UtilisateurId = utilisateur.Id });
        }
        else if (utilisateur is Responsable responsable)
        {
            _context.Responsables.Add(responsable);
        }
        else if (utilisateur is Professeur professeur)
        {
            _context.Professeurs.Add(professeur);
        }
        else if (utilisateur is Etudiant etudiant)
        {
            _context.Etudiants.Add(etudiant);
        }

        await _context.SaveChangesAsync();
        return MapToDTO(utilisateur);
    }
    
    public async Task<bool> UpdateUtilisateur(int id, UpdateUtilisateurRequest request)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);
        if (utilisateur == null)
            return false;
            
        if (request.Nom != null) utilisateur.Nom = request.Nom;
        if (request.Prenom != null) utilisateur.Prenom = request.Prenom;
        if (request.Telephone != null) utilisateur.Telephone = request.Telephone;
        if (request.IsActive.HasValue) utilisateur.IsActive = request.IsActive.Value;
        
        utilisateur.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> DeleteUtilisateur(int id)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);
        if (utilisateur == null)
            return false;
            
        _context.Utilisateurs.Remove(utilisateur);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<List<UtilisateurDTO>> GetUtilisateursByRole(string role)
    {
        if (!Enum.TryParse<Role>(role, true, out var roleEnum))
            throw new ArgumentException("Rôle invalide", nameof(role));

        var utilisateurs = await _context.Utilisateurs
            .Where(u => u.Role == roleEnum)
            .ToListAsync();
            
        return utilisateurs.Select(MapToDTO).ToList();
    }
    
    private UtilisateurDTO MapToDTO(Utilisateur utilisateur)
    {
        return new UtilisateurDTO
        {
            Id = utilisateur.Id,
            Nom = utilisateur.Nom,
            Prenom = utilisateur.Prenom,
            Email = utilisateur.Email,
            Telephone = utilisateur.Telephone,
            Role = utilisateur.Role.ToString(),
            IsActive = utilisateur.IsActive
        };
    }

    public async Task<List<UtilisateurDTO>> GetAllEtudiantsAsync()
    {
        var etudiants = await _context.Utilisateurs
            .Where(u => u.Role == Role.Etudiant)
            .ToListAsync();

        return etudiants.Select(MapToDTO).ToList();
    }

    public async Task<UtilisateurDTO?> GetEtudiantByIdAsync(int id)
    {
        var etudiant = await _context.Utilisateurs
            .FirstOrDefaultAsync(u =>
                u.Id == id &&
                u.Role == Role.Etudiant);

        return etudiant != null ? MapToDTO(etudiant) : null;
    }

    public async Task CreateEtudiantWithDtoAsync(
        CreateUtilisateurRequest request,
        string matricule,
        string niveau,
        string? groupe,
        int idFiliere,
        int idClasse
    )
    {
        var etudiant = new Etudiant
        {
            Nom = request.Nom,
            Prenom = request.Prenom,
            Email = request.Email,
            MotDePasse = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Telephone = request.Telephone,
            Role = Role.Etudiant,
            IsActive = true,
            Matricule = matricule,
            Niveau = niveau,
            Groupe = groupe,
            IdFiliere = idFiliere,
            IdClasse = idClasse
        };

        _context.Etudiants.Add(etudiant);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteEtudiantAsync(int id)
    {
        var etudiant = await _context.Etudiants
            .FirstOrDefaultAsync(e => e.Id == id);

        if (etudiant == null)
            return false;

        _context.Etudiants.Remove(etudiant);
        await _context.SaveChangesAsync();

        return true;
    }
}
