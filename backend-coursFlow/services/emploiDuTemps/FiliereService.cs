using BackendCoursFlow.Models.EmploiDuTemps;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Donnees;

namespace BackendCoursFlow.Services.EmploiDuTemps;

public class FiliereService
{
    private readonly ApplicationDbContext _context;

    public FiliereService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Récupérer toutes les filières
    public async Task<List<FiliereDTO>> GetAllFilieresAsync()
    {
        var filieres = await _context.Filieres.ToListAsync();

        return filieres.Select(f => new FiliereDTO
        {
            IdFiliere = f.IdFiliere,
            Nom = f.Nom,
            Description = f.Description
        }).ToList();
    }

    // Récupérer une filière par ID
    public async Task<FiliereDTO?> GetFiliereByIdAsync(int id)
    {
        var filiere = await _context.Filieres.FindAsync(id);
        if (filiere == null) return null;

        return new FiliereDTO
        {
            IdFiliere = filiere.IdFiliere,
            Nom = filiere.Nom,
            Description = filiere.Description
        };
    }

    // Ajout 
    public async Task<Filiere> CreateFiliereAsync(CreateFiliereRequest request)
    {
        var nouvelleFiliere = new Filiere
        {
            Nom = request.Nom,
            Description = request.Description
        };

        _context.Filieres.Add(nouvelleFiliere);
        await _context.SaveChangesAsync();

        return nouvelleFiliere;
    }

    // Mettre à jour
    public async Task<bool> UpdateFiliereAsync(int id, FiliereDTO filiereDto)
    {
        var filiere = await _context.Filieres.FindAsync(id);
        if (filiere == null) return false;

        filiere.Nom = filiereDto.Nom;
        filiere.Description = filiereDto.Description;

        await _context.SaveChangesAsync();
        return true;
    }

    // Suppression
    public async Task<bool> DeleteFiliereAsync(int id)
    {
        var filiere = await _context.Filieres.FindAsync(id);
        if (filiere == null) return false;

        _context.Filieres.Remove(filiere);
        await _context.SaveChangesAsync();
        return true;
    }
}