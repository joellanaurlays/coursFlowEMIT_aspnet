using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendCoursFlow.Models.Salles;
using BackendCoursFlow.Models.Utilisateurs;
using BackendCoursFlow.Models.EmploiDuTemps;

namespace BackendCoursFlow.Models.Pedagogies;

public class Cours
{
    [Key]
    public int IdCours { get; set; }

    // Informations générales
    [Required]
    public string AnneeUniversitaire { get; set; } = string.Empty;

    [Required]
    public string Semestre { get; set; } = string.Empty;

    [Required]
    public string TypeCours { get; set; } = string.Empty;

    // durée d'une séance (minutes)
    public int Duree { get; set; }

    // volume horaire total
    public int VolumeHoraire { get; set; }

    // Clés étrangères    
    public int MatiereId { get; set; }

    public int ProfesseurId { get; set; }

    public int? SalleId { get; set; }

    // Navigation
    [ForeignKey(nameof(MatiereId))]
    public virtual Matiere Matiere { get; set; } = null!;

    [ForeignKey(nameof(ProfesseurId))]
    public virtual Professeur Professeur { get; set; } = null!;

    [ForeignKey(nameof(SalleId))]
    public virtual Salle? Salle { get; set; }

    public virtual ICollection<EmploiDuTemps> EmploisDuTemps { get; set; }
        = new List<EmploiDuTemps>();
}