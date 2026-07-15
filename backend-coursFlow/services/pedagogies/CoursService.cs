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
                Id = c.IdCours,
                Titre = c.AnneeUniversitaire,
                Description = c.TypeCours,
                MatiereId = c.MatiereId,
                Matiere = c.Matiere.Nom
            })
            .ToListAsync();
    }

    public async Task<CoursDTO?> GetCoursById(int id)
    {
        var cours = await _context.Cours
            .Include(c => c.Matiere)
            .FirstOrDefaultAsync(c => c.IdCours == id);

        if (cours == null)
            return null;

        return new CoursDTO
        {
            Id = cours.IdCours,
            Titre = cours.AnneeUniversitaire,
            Description = cours.TypeCours,
            MatiereId = cours.MatiereId,
            Matiere = cours.Matiere.Nom
        };
    }

    public async Task<CoursDTO> CreateCours(CreateCoursRequest request)
    {
        var cours = new Cours
        {
            AnneeUniversitaire = request.AnneeUniversitaire,
            Semestre = request.Semestre,
            TypeCours = request.TypeCours,
            Duree = request.Duree,
            VolumeHoraire = request.VolumeHoraire,
            MatiereId = request.MatiereId
        };

        _context.Cours.Add(cours);

        await _context.SaveChangesAsync();

        return await GetCoursById(cours.IdCours);
    }

    public async Task<bool> UpdateCours(int id, CreateCoursRequest request)
    {
        var cours = await _context.Cours.FindAsync(id);

        if (cours == null)
            return false;

        cours.AnneeUniversitaire = request.AnneeUniversitaire;
        cours.Semestre = request.Semestre;
        cours.TypeCours = request.TypeCours;
        cours.Duree = request.Duree;
        cours.VolumeHoraire = request.VolumeHoraire;
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