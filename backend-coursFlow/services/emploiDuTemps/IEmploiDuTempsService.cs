using BackendCoursFlow.Models;
using BackendCoursFlow.DTOs;
namespace BackendCoursFlow.Services.EmploiDuTemps;

public interface IEmploiDuTempsService
{
    Task<List<EmploiDuTempsDTO>> GetEmploiByClasse(int classeId, string? semaine = null);
    Task<List<EmploiDuTempsDTO>> GetEmploiByProfesseur(int professeurId, string? semaine = null);
    Task<List<EmploiDuTempsDTO>> GetEmploiBySalle(int salleId, string? semaine = null);
    Task<EmploiDuTempsDTO> CreateEmploi(CreateEmploiDuTempsRequest request);
    Task<bool> UpdateEmploi(int id, CreateEmploiDuTempsRequest request);
    Task<bool> DeleteEmploi(int id);
    Task<bool> VerifierConflit(CreateEmploiDuTempsRequest request);
    Task<byte[]> ExporterEmploiPDF(int classeId, string periode);
}

public class EmploiDuTempsService : IEmploiDuTempsService
{
    private readonly ApplicationDbContext _context;
    
    public EmploiDuTempsService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<EmploiDuTempsDTO>> GetEmploiByClasse(int classeId, string? semaine = null)
    {
        var query = _context.EmploisDuTemps
            .Include(e => e.Cours)
                .ThenInclude(c => c.Matiere)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Professeur)
                    .ThenInclude(p => p.Utilisateur)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Salle)
            .Include(e => e.Classe)
                .ThenInclude(c => c.Filiere)
            .Where(e => e.ClasseId == classeId);
            
        if (!string.IsNullOrEmpty(semaine))
        {
            var dates = GetWeekDates(semaine);
            query = query.Where(e => e.DateDebut >= dates.Start && e.DateFin <= dates.End);
        }
        
        var emplois = await query.ToListAsync();
        return emplois.Select(MapToDTO).ToList();
    }
    
    public async Task<List<EmploiDuTempsDTO>> GetEmploiByProfesseur(int professeurId, string? semaine = null)
    {
        var query = _context.EmploisDuTemps
            .Include(e => e.Cours)
                .ThenInclude(c => c.Matiere)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Professeur)
                    .ThenInclude(p => p.Utilisateur)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Salle)
            .Include(e => e.Classe)
                .ThenInclude(c => c.Filiere)
            .Where(e => e.Cours.ProfesseurId == professeurId);
            
        if (!string.IsNullOrEmpty(semaine))
        {
            var dates = GetWeekDates(semaine);
            query = query.Where(e => e.DateDebut >= dates.Start && e.DateFin <= dates.End);
        }
        
        var emplois = await query.ToListAsync();
        return emplois.Select(MapToDTO).ToList();
    }
    
    public async Task<List<EmploiDuTempsDTO>> GetEmploiBySalle(int salleId, string? semaine = null)
    {
        var query = _context.EmploisDuTemps
            .Include(e => e.Cours)
                .ThenInclude(c => c.Matiere)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Professeur)
                    .ThenInclude(p => p.Utilisateur)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Salle)
            .Include(e => e.Classe)
                .ThenInclude(c => c.Filiere)
            .Where(e => e.Cours.SalleId == salleId);
            
        if (!string.IsNullOrEmpty(semaine))
        {
            var dates = GetWeekDates(semaine);
            query = query.Where(e => e.DateDebut >= dates.Start && e.DateFin <= dates.End);
        }
        
        var emplois = await query.ToListAsync();
        return emplois.Select(MapToDTO).ToList();
    }
    
    public async Task<EmploiDuTempsDTO> CreateEmploi(CreateEmploiDuTempsRequest request)
    {
        // Vérifier les conflits
        var hasConflict = await VerifierConflit(request);
        if (hasConflict)
            throw new Exception("Conflit détecté dans l'emploi du temps");
            
        var emploi = new EmploiDuTemps
        {
            Jour = Enum.Parse<JourSemaine>(request.Jour),
            HeureDebut = TimeSpan.Parse(request.HeureDebut),
            HeureFin = TimeSpan.Parse(request.HeureFin),
            DateDebut = request.DateDebut,
            DateFin = request.DateFin,
            CoursId = request.CoursId,
            ClasseId = request.ClasseId
        };
        
        _context.EmploisDuTemps.Add(emploi);
        await _context.SaveChangesAsync();
        
        return await GetEmploiById(emploi.IdEmploi);
    }
    
    public async Task<bool> UpdateEmploi(int id, CreateEmploiDuTempsRequest request)
    {
        var emploi = await _context.EmploisDuTemps.FindAsync(id);
        if (emploi == null)
            return false;
            
        // Vérifier les conflits (exclure l'emploi actuel)
        var hasConflict = await VerifierConflit(request, id);
        if (hasConflict)
            throw new Exception("Conflit détecté dans l'emploi du temps");
            
        emploi.Jour = Enum.Parse<JourSemaine>(request.Jour);
        emploi.HeureDebut = TimeSpan.Parse(request.HeureDebut);
        emploi.HeureFin = TimeSpan.Parse(request.HeureFin);
        emploi.DateDebut = request.DateDebut;
        emploi.DateFin = request.DateFin;
        emploi.CoursId = request.CoursId;
        emploi.ClasseId = request.ClasseId;
        
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> DeleteEmploi(int id)
    {
        var emploi = await _context.EmploisDuTemps.FindAsync(id);
        if (emploi == null)
            return false;
            
        _context.EmploisDuTemps.Remove(emploi);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> VerifierConflit(CreateEmploiDuTempsRequest request, int? excludeId = null)
    {
        var heureDebut = TimeSpan.Parse(request.HeureDebut);
        var heureFin = TimeSpan.Parse(request.HeureFin);
        var jour = Enum.Parse<JourSemaine>(request.Jour);
        
        // Vérifier les conflits pour la classe
        var conflitClasse = await _context.EmploisDuTemps
            .Where(e => e.ClasseId == request.ClasseId && 
                        e.Jour == jour &&
                        (excludeId == null || e.IdEmploi != excludeId) &&
                        ((heureDebut >= e.HeureDebut && heureDebut < e.HeureFin) ||
                         (heureFin > e.HeureDebut && heureFin <= e.HeureFin) ||
                         (heureDebut <= e.HeureDebut && heureFin >= e.HeureFin)))
            .AnyAsync();
            
        if (conflitClasse)
            return true;
            
        // Vérifier les conflits pour le professeur
        var cours = await _context.Cours.FindAsync(request.CoursId);
        if (cours != null)
        {
            var conflitProf = await _context.EmploisDuTemps
                .Include(e => e.Cours)
                .Where(e => e.Cours.ProfesseurId == cours.ProfesseurId &&
                            e.Jour == jour &&
                            (excludeId == null || e.IdEmploi != excludeId) &&
                            ((heureDebut >= e.HeureDebut && heureDebut < e.HeureFin) ||
                             (heureFin > e.HeureDebut && heureFin <= e.HeureFin) ||
                             (heureDebut <= e.HeureDebut && heureFin >= e.HeureFin)))
                .AnyAsync();
                
            if (conflitProf)
                return true;
        }
        
        // Vérifier les conflits pour la salle
        if (cours?.SalleId != null)
        {
            var conflitSalle = await _context.EmploisDuTemps
                .Include(e => e.Cours)
                .Where(e => e.Cours.SalleId == cours.SalleId &&
                            e.Jour == jour &&
                            (excludeId == null || e.IdEmploi != excludeId) &&
                            ((heureDebut >= e.HeureDebut && heureDebut < e.HeureFin) ||
                             (heureFin > e.HeureDebut && heureFin <= e.HeureFin) ||
                             (heureDebut <= e.HeureDebut && heureFin >= e.HeureFin)))
                .AnyAsync();
                
            if (conflitSalle)
                return true;
        }
        
        return false;
    }
    
    public async Task<byte[]> ExporterEmploiPDF(int classeId, string periode)
    {
        // Implémentation de l'export PDF
        // Utiliser une bibliothèque comme iTextSharp ou QuestPDF
        // Pour l'instant, retournons un tableau vide
        await Task.Delay(100);
        return Array.Empty<byte>();
    }
    
    private async Task<EmploiDuTempsDTO> GetEmploiById(int id)
    {
        var emploi = await _context.EmploisDuTemps
            .Include(e => e.Cours)
                .ThenInclude(c => c.Matiere)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Professeur)
                    .ThenInclude(p => p.Utilisateur)
            .Include(e => e.Cours)
                .ThenInclude(c => c.Salle)
            .Include(e => e.Classe)
                .ThenInclude(c => c.Filiere)
            .FirstOrDefaultAsync(e => e.IdEmploi == id);
            
        return MapToDTO(emploi);
    }
    
    private EmploiDuTempsDTO MapToDTO(EmploiDuTemps emploi)
    {
        return new EmploiDuTempsDTO
        {
            IdEmploi = emploi.IdEmploi,
            Jour = emploi.Jour.ToString(),
            HeureDebut = emploi.HeureDebut.ToString(@"hh\:mm"),
            HeureFin = emploi.HeureFin.ToString(@"hh\:mm"),
            DateDebut = emploi.DateDebut,
            DateFin = emploi.DateFin,
            Cours = new CoursInfoDTO
            {
                IdCours = emploi.Cours.IdCours,
                MatiereNom = emploi.Cours.Matiere.Nom,
                ProfesseurNom = $"{emploi.Cours.Professeur.Utilisateur.Prenom} {emploi.Cours.Professeur.Utilisateur.Nom}",
                TypeCours = emploi.Cours.TypeCours.ToString(),
                SalleNom = emploi.Cours.Salle?.Nom
            },
            Classe = new ClasseInfoDTO
            {
                IdClasse = emploi.Classe.IdClasse,
                Nom = emploi.Classe.Nom,
                Niveau = emploi.Classe.Niveau ?? "",
                Groupe = emploi.Classe.Groupe ?? "",
                FiliereNom = emploi.Classe.Filiere.Nom
            }
        };
    }
    
    private (DateTime Start, DateTime End) GetWeekDates(string semaine)
    {
        // Format: "YYYY-WW" (ex: "2024-01")
        var parts = semaine.Split('-');
        var year = int.Parse(parts[0]);
        var week = int.Parse(parts[1]);
        
        var startDate = FirstDateOfWeek(year, week);
        var endDate = startDate.AddDays(6);
        
        return (startDate, endDate);
    }
    
    private DateTime FirstDateOfWeek(int year, int weekOfYear)
    {
        DateTime jan1 = new DateTime(year, 1, 1);
        int daysOffset = (int)jan1.DayOfWeek - (int)DayOfWeek.Monday;
        DateTime firstMonday = jan1.AddDays(-daysOffset);
        
        return firstMonday.AddDays((weekOfYear - 1) * 7);
    }
}
