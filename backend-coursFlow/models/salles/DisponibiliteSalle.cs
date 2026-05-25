using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendCoursFlow.Models.Enums;
using BackendCoursFlow.Models.Pedagogies;

namespace BackendCoursFlow.Models.Salles;
public class DisponibiliteSalle
{
    [Key]
    public int IdDispoSalle { get; set; }
    
    public JourSemaine Jour { get; set; }
    public TimeSpan HeureDebut { get; set; }
    public TimeSpan HeureFin { get; set; }
    public TypeDisponibilite Type { get; set; }
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    
    public int SalleId { get; set; }
    
    [ForeignKey("SalleId")]
    public virtual Salle Salle { get; set; } = null!;
}
