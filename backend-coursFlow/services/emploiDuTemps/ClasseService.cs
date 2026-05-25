using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.EmploiDuTemps;
using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Services.EmploiDuTemps;

public class ClasseService
{
    private readonly ApplicationDbContext _context;

    public ClasseService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Récupérer toutes les classes
    public async Task<List<ClasseDTOs>> GetAllClassesAsync()
    {
        var classes = await _context.Classes
            .Include(c => c.Filiere)
            .ToListAsync();

        return classes.Select(c => new ClasseDTOs
        {
            IdClasse = c.IdClasse,
            Nom = c.Nom,
            Niveau = c.Niveau,
            Groupe = c.Groupe,
            IdFiliere = c.IdFiliere,
            NomFiliere = c.Filiere?.Nom ?? "Inconnue"
        }).ToList();
    }

    // Récupérer une classe avec son EDT
    public async Task<Classe?> GetClasseWithCoursAsync(int id)
    {
        return await _context.Classes
            .Include(c => c.Filiere)
            .Include(c => c.Cours)
                .ThenInclude(cours => cours.Matiere)
            .Include(c => c.Cours)
                .ThenInclude(cours => cours.Professeur)
            .FirstOrDefaultAsync(c => c.IdClasse == id);
    }

    // Récupérer toutes les classes d'une filière
    public async Task<List<ClasseDTOs>> GetClassesByFiliereAsync(int filiereId)
    {
        var classes = await _context.Classes
            .Include(c => c.Filiere)
            .Where(c => c.IdFiliere == filiereId)
            .ToListAsync();

        return classes.Select(c => new ClasseDTOs
        {
            IdClasse = c.IdClasse,
            Nom = c.Nom,
            Niveau = c.Niveau,
            Groupe = c.Groupe,
            IdFiliere = c.IdFiliere,
            NomFiliere = c.Filiere?.Nom ?? "Inconnue"
        }).ToList();
    }

    // Ajout 
    public async Task<Classe> CreateClasseAsync(CreateClasseRequest request)
    {
        var nouvelleClasse = new Classe
        {
            Nom = request.Nom,
            Niveau = request.Niveau,
            Groupe = request.Groupe,
            IdFiliere = request.IdFiliere
        };

        _context.Classes.Add(nouvelleClasse);
        await _context.SaveChangesAsync();

        return nouvelleClasse; 
    }

    // Suppression
    public async Task DeleteClasseAsync(int id)
    {
        var classe = await _context.Classes.FindAsync(id);
        if (classe != null)
        {
            _context.Classes.Remove(classe);
            await _context.SaveChangesAsync();
        }
    }
}