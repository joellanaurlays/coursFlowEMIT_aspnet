using BackendCoursFlow.Donnees;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.Models.Enums;

namespace BackendCoursFlow.Services.EmploiDuTemps;

public interface IMatiereService
{
    Task<List<MatiereDTO>> GetAllMatieres();
    Task<MatiereDTO?> GetMatiereById(int id);
    Task<MatiereDTO> CreateMatiere(CreateMatiereRequest request);
    Task<bool> UpdateMatiere(int id, CreateMatiereRequest request);
    Task<bool> DeleteMatiere(int id);
    Task<List<MatiereDTO>> GetMatieresByFiliere(int filiereId);
}

public class MatiereService : IMatiereService
{
    private readonly ApplicationDbContext _context;
    
    public MatiereService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<MatiereDTO>> GetAllMatieres()
    {
        var matieres = await _context.Matieres
            .Include(m => m.PreRequis)
            .ToListAsync();
            
        return matieres.Select(MapToDTO).ToList();
    }
    
    public async Task<MatiereDTO?> GetMatiereById(int id)
    {
        var matiere = await _context.Matieres
            .Include(m => m.PreRequis)
            .FirstOrDefaultAsync(m => m.IdMatiere == id);
            
        return matiere != null ? MapToDTO(matiere) : null;
    }
    
    public async Task<MatiereDTO> CreateMatiere(CreateMatiereRequest request)
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
        
        var existingPreRequis = _context.PreRequis.Where(pr => pr.MatiereId == id);
        _context.PreRequis.RemoveRange(existingPreRequis);
        
        if (request.PreRequisIds != null)
        {
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
    
    public async Task<List<MatiereDTO>> GetMatieresByFiliere(int filiereId)
    {
        var matieres = await _context.Matieres
            .Include(m => m.PreRequis)
            .Take(100)
            .ToListAsync();
            
        return matieres.Select(MapToDTO).ToList();
    }
    
    private MatiereDTO MapToDTO(Matiere matiere)
    {
        return new MatiereDTO
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