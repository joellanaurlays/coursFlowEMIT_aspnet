using BackendCoursFlow.Donnees;
using BackendCoursFlow.Models.EmploiDuTemps;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.Models.Enums;
using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Services.EmploiDuTemps;
public class DisponibiliteService
{
    private readonly ApplicationDbContext _context;

    public DisponibiliteService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Récupérer toutes les disponibilités d'un professeur
    public async Task<List<DisponibiliteDTOs>> GetByProfesseurAsync(int profId)
    {
        var disponibilites = await _context.Disponibilites
            .Include(d => d.Professeur)
                .ThenInclude(p => p.Utilisateur)
            .Where(d => d.IdProf == profId)
            .OrderBy(d => d.Jour)
            .ThenBy(d => d.HeureDebut)
            .ToListAsync();

        return disponibilites.Select(d => new DisponibiliteDTOs
        {
            IdDispo = d.IdDispo,
            Jour = d.Jour.ToString(),
            HeureDebut = d.HeureDebut.ToString(@"hh\:mm"),
            HeureFin = d.HeureFin.ToString(@"hh\:mm"),
            Type = d.Type.ToString(),
            ProfesseurId = d.IdProf,
            ProfesseurNom = d.Professeur != null && d.Professeur.Utilisateur != null
                ? $"{d.Professeur.Utilisateur.Nom} {d.Professeur.Utilisateur.Prenom}"
                : "Inconnu"
        }).ToList();
    }

    // Ajout d'une disponibilité 
    public async Task<bool> CreateDisponibiliteAsync(CreateDisponibiliteRequest requete, int profId)
    {
        if (!Enum.TryParse<JourSemaine>(requete.Jour, true, out var jourParsed) ||
            !Enum.TryParse<TypeDisponibilite>(requete.Type, true, out var typeParsed) ||
            !TimeSpan.TryParse(requete.HeureDebut, out var debutParsed) ||
            !TimeSpan.TryParse(requete.HeureFin, out var finParsed))
        {
            return false; // Données invalides
        }

        bool hasConflict = await _context.Disponibilites.AnyAsync(d =>
            d.IdProf == profId &&
            d.Jour == jourParsed &&
            ((debutParsed >= d.HeureDebut && debutParsed < d.HeureFin) ||
             (finParsed > d.HeureDebut && finParsed <= d.HeureFin)));

        if (hasConflict) return false;

        var nouvelleDisponibilite = new Disponibilite
        {
            IdProf = profId,
            Jour = jourParsed,
            HeureDebut = debutParsed,
            HeureFin = finParsed,
            Type = typeParsed
        };

        _context.Disponibilites.Add(nouvelleDisponibilite);
        await _context.SaveChangesAsync();
        return true;
    }

    // Suppression
    public async Task DeleteDisponibiliteAsync(int id)
    {
        var dispo = await _context.Disponibilites.FindAsync(id);
        if (dispo != null)
        {
            _context.Disponibilites.Remove(dispo);
            await _context.SaveChangesAsync();
        }
    }
}