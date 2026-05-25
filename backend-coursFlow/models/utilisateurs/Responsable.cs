using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendCoursFlow.Models.Pedagogies;

namespace BackendCoursFlow.Models.Utilisateurs;


public class Responsable : Utilisateur
{
    
    [Required]
    public int UtilisateurId { get; set; }
    
    [ForeignKey("UtilisateurId")]
    public virtual Utilisateur Utilisateur { get; set; } = null!;

    public List<Cours> Cours { get; set; } = new();

    public List<Matiere> Matieres { get; set; } = new();
    public List<BackendCoursFlow.Models.Pedagogies.EmploiDuTemps> EmploisDuTemps { get; set; } = new();

    public void AjouterMatiere(Matiere matiere) {   }
    
    public List<Professeur> AfficherProfesseurs()
    {
        return new List<Professeur>();
    }
    
    public void GererEmploiDuTemps(BackendCoursFlow.Models.Pedagogies.EmploiDuTemps edt) { }
    
    public void ImprimerEmploiDuTemps(int classeId, string periode) { }
}