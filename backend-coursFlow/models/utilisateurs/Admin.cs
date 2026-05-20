
namespace BackendCoursFlow.Models.Utilisateurs;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Admin
{
    [Key]
    public int IdAdmin { get; set; }
    
    [Required]
    public int UtilisateurId { get; set; }
    
    [ForeignKey("UtilisateurId")]
    public virtual Utilisateur Utilisateur { get; set; } = null!;
    
    public void GererUtilisateur(int utilisateurId, string action) { }
    
    public void ParametrerAnneeUniversitaire(string annee, DateTime dateDebut, DateTime dateFin) { }
}
    