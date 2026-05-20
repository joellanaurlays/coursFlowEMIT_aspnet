using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Services.EmploiDuTemps;

public interface IMatiereService
{
    Task<List<MatiereDTOs>> GetAllMatieres();
    Task<MatiereDTOs?> GetMatiereById(int id);
    Task<MatiereDTOs> CreateMatiere(CreateMatiereRequest request);
    Task<bool> UpdateMatiere(int id, CreateMatiereRequest request);
    Task<bool> DeleteMatiere(int id);
    Task<List<MatiereDTOs>> GetMatieresByFiliere(int filiereId);
}

public class MatiereService : IMatiereService
{
    private readonly ApplicationDbContext _context;
    
    public MatiereService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<MatiereDTOs>> GetAllMatieres()
    {
        var matieres = await _context.Matieres
            .Include(m => m.PreRequis)
            .ToListAsync();
            
        return matieres.Select(MapToDTO).ToList();
    }
    
    public async Task<MatiereDTOs?> GetMatiereById(int id)
    {
        var matiere = await _context.Matieres
            .Include(m => m.PreRequis)
            .FirstOrDefaultAsync(m => m.IdMatiere == id);
            
        return matiere != null ? MapToDTO(matiere) : null;
    }
    
    public async Task<MatiereDTOs> CreateMatiere(CreateMatiereRequest request)
    {
        var matiere = new Matiere
        {
            Code = request.Code,
            Nom = request.Nom,
            Description = request.Description,
            Credits = request.Credits,
            VolumeHoraireGlobal = request.VolumeHoraireGlobal
        };
        
        _context.Matieres.Add(matiere);
        await _context.SaveChangesAsync();
        
        // Ajouter les prérequis
        if (request.PreRequisIds != null && request.PreRequisIds.Any())
        {
            foreach (var prerequisId in request.PreRequisIds)
            {
                var prerequis = new PreRequis
                {
                    MatiereId = matiere.IdMatiere,
                    MatierePrerequisId = prerequisId
                };
                _context.PreRequis.Add(prerequis);
            }
            await _context.SaveChangesAsync();
        }
        
        return MapToDTO(matiere);
    }
    
    public async Task<bool> UpdateMatiere(int id, CreateMatiereRequest request)
    {
        var matiere = await _context.Matieres.FindAsync(id);
        if (matiere == null)
            return false;
            
        matiere.Code = request.Code;
        matiere.Nom = request.Nom;
        matiere.Description = request.Description;
        matiere.Credits = request.Credits;
        matiere.VolumeHoraireGlobal = request.VolumeHoraireGlobal;
        
        // Mettre à jour les prérequis
        if (request.PreRequisIds != null)
        {
            var existingPreRequis = _context.PreRequis.Where(pr => pr.MatiereId == id);
            _context.PreRequis.RemoveRange(existingPreRequis);
            
            foreach (var prerequisId in request.PreRequisIds)
            {
                var prerequis = new PreRequis
                {
                    MatiereId = id,
                    MatierePrerequisId = prerequisId
                };
                _context.PreRequis.Add(prerequis);
            }
        }
        
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> DeleteMatiere(int id)
    {
        var matiere = await _context.Matieres.FindAsync(id);
        if (matiere == null)
            return false;
            
        _context.Matieres.Remove(matiere);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<List<MatiereDTOs>> GetMatieresByFiliere(int filiereId)
    {
        // Logique pour récupérer les matières d'une filière
        var matieres = await _context.Matieres
            .Include(m => m.PreRequis)
            .Take(100)
            .ToListAsync();
            
        return matieres.Select(MapToDTO).ToList();
    }
    
    private MatiereDTOs MapToDTO(Matiere matiere)
    {
        return new MatiereDTOs
        {
            IdMatiere = matiere.IdMatiere,
            Code = matiere.Code,
            Nom = matiere.Nom,
            Description = matiere.Description,
            Credits = matiere.Credits,
            VolumeHoraireGlobal = matiere.VolumeHoraireGlobal,
            PreRequisIds = matiere.PreRequis?.Select(pr => pr.MatierePrerequisId).ToList()
        };
    }
}