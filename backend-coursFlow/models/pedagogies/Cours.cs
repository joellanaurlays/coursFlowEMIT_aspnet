using System.ComponentModel.DataAnnotations.Schema;
namespace BackendCoursFlow.Models.Pedagogies;

public class Cours
{
    [Key]
    public int IdCours { get; set; }
    
    public string AnneeUniversitaire { get; set; } = string.Empty;
    public string Semestre { get; set; } = string.Empty;
    public TypeCours TypeCours { get; set; }
    public int Duree { get; set; } // en minutes
    public int VolumeHoraire { get; set; }
    
    public int MatiereId { get; set; }
    public int ProfesseurId { get; set; }
    public int? SalleId { get; set; }
    
    [ForeignKey("MatiereId")]
    public virtual Matiere Matiere { get; set; } = null!;
    
    [ForeignKey("ProfesseurId")]
    public virtual Professeur Professeur { get; set; } = null!;
    
    [ForeignKey("SalleId")]
    public virtual Salle? Salle { get; set; }
    
    public virtual ICollection<EmploiDuTemps> EmploisDuTemps { get; set; } = new List<EmploiDuTemps>();
}