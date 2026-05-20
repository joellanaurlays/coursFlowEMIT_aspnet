namespace BackendCoursFlow.Models.Pedagogies;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AnneeUniversitaire
{
    [Key]
    public int Id { get; set; }
    
    [Required, MaxLength(20)]
    public string Annee { get; set; } = string.Empty;
    
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    
    public bool EstActive { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
