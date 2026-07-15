using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Donnees;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.Pedagogies;

namespace BackendCoursFlow.Services.Pedagogies;

public class CoursService : ICoursService
{
    private readonly ApplicationDbContext _context;

    public CoursService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CoursDTO>> GetAllCours()
    {
        return await _context.Cours
            .Include(c => c.Matiere)
            .Select(c => new CoursDTO
            {
                Id = c.Id,
                Titre = c.Titre,
                Description = c.Description,
                MatiereId = c.MatiereId,
                Matiere = c.Matiere.Nom
            })
            .ToListAsync();
    }

    public async Task<CoursDTO?> GetCoursById(int id)
    {
        var cours = await _context.Cours
            .Include(c => c.Matiere)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cours == null)
            return null;

        return new CoursDTO
        {
            Id = cours.Id,
            Titre = cours.Titre,
            Description = cours.Description,
            MatiereId = cours.MatiereId,
            Matiere = cours.Matiere.Nom
        };
    }

    public async Task<CoursDTO> CreateCours(CreateCoursRequest request)
    {
        var cours = new Cours
        {
            Titre = request.Titre,
            Description = request.Description,
            MatiereId = request.MatiereId
        };

        _context.Cours.Add(cours);

        await _context.SaveChangesAsync();

        return await GetCoursById(cours.Id);
    }

    public async Task<bool> UpdateCours(int id, CreateCoursRequest request)
    {
        var cours = await _context.Cours.FindAsync(id);

        if (cours == null)
            return false;

        cours.Titre = request.Titre;
        cours.Description = request.Description;
        cours.MatiereId = request.MatiereId;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteCours(int id)
    {
        var cours = await _context.Cours.FindAsync(id);

        if (cours == null)
            return false;

        _context.Cours.Remove(cours);

        await _context.SaveChangesAsync();

        return true;
    }
}