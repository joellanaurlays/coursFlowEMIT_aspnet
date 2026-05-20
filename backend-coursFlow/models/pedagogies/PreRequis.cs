using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackendCoursFlow.Models.Pedagogies;

public class PreRequis
{
    [Key]
    public int Id { get; set; }
    
    public int MatiereId { get; set; }
    public int MatierePrerequisId { get; set; }
    
    [ForeignKey("MatiereId")]
    public virtual Matiere Matiere { get; set; } = null!;
    
    [ForeignKey("MatierePrerequisId")]
    public virtual Matiere MatierePrerequis { get; set; } = null!;
}