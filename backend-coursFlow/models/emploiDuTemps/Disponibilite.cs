using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendCoursFlow.Models.Enums;
using BackendCoursFlow.Models.Utilisateurs;
namespace BackendCoursFlow.Models.EmploiDuTemps;
public class Disponibilite
{
    [Key]
    public int IdDispo { get; set; }
    public JourSemaine Jour { get; set; }
    public TimeSpan HeureDebut { get; set; }
    public TimeSpan HeureFin { get; set; }
    public TypeDisponibilite Type { get; set; }

    [ForeignKey("Professeur")]
    public int IdProf { get; set; }
    public virtual Professeur Professeur { get; set; } = default!;

    public void AjouterDisponibilite() { }
    public void ModifierDisponibilite() { }
    public void SupprimerDisponibilite() { }
}