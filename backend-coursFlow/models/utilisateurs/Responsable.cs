namespace BackendCoursFlow.Models.Utilisateurs;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendCoursFlow.Models.Pedagogies;

public class Responsable : Utilisateur
{
    [Key]
    public int IdResp { get; set; }
    
    [Required]
    public int UtilisateurId { get; set; }
    
    [ForeignKey("UtilisateurId")]
    public virtual Utilisateur Utilisateur { get; set; } = null!;
    
    public void AjouterMatiere(Matiere matiere) {   }
    
    public List<Professeur> AfficherProfesseurs()
    {
        return new List<Professeur>();
    }
    
    public void GererEmploiDuTemps(EmploiDuTemps edt) { }
    
    public void ImprimerEmploiDuTemps(int classeId, string periode) { }
}