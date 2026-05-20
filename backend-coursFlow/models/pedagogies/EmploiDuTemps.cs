using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackendCoursFlow.Models.Pedagogies;


public class EmploiDuTemps
{
    [Key]
    public int IdEmploi { get; set; }
    
    public JourSemaine Jour { get; set; }
    public TimeSpan HeureDebut { get; set; }
    public TimeSpan HeureFin { get; set; }
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    
    public int CoursId { get; set; }
    public int ClasseId { get; set; }
    
    [ForeignKey("CoursId")]
    public virtual Cours Cours { get; set; } = null!;
    
    [ForeignKey("ClasseId")]
    public virtual Classe Classe { get; set; } = null!;

    public void GenererPDF() { }

    public void AfficherEmploi() { }
}
    
    
    