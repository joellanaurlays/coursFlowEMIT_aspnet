using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.Models.EmploiDuTemps; 
using BackendCoursFlow.Models.Enums;
namespace BackendCoursFlow.Models.Utilisateurs;

public class Etudiant : Utilisateur
{
    public string Matricule { get; set; } = "";
    public string Niveau { get; set; } = "";
    public string? Groupe { get; set; }

    public int IdFiliere { get; set; }
    public virtual Filiere Filiere { get; set; } = default!;

    // 1 Classe -> * Etudiants
    public int IdClasse { get; set; }
    public virtual Classe Classe { get; set; } = default!;

    public void ConsulterEDT() { }
}