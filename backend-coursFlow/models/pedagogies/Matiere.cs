
namespace BackendCoursFlow.Models.Pedagogies;

public class Matiere
{
 [Key]
    public int IdMatiere { get; set; }
    
    [Required, MaxLength(50)]
    public string Code { get; set; } = string.Empty;
    
    [Required, MaxLength(200)]
    public string Nom { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public int Credits { get; set; }
    
    public int VolumeHoraireGlobal { get; set; }
    
    // Navigation properties
    public virtual ICollection<Cours> Cours { get; set; } = new List<Cours>();
    public virtual ICollection<PreRequis> PreRequis { get; set; } = new List<PreRequis>();
    public virtual ICollection<PreRequis> PreRequisPour { get; set; } = new List<PreRequis>();
    
    public void AjouterMatiere() { }

    public void ModifierMatiere() { }
}


