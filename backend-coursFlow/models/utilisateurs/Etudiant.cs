using System.ComponentModel.DataAnnotations.Schema;

using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.Models.EmploiDuTemps; 
using BackendCoursFlow.Models.Enums;
namespace BackendCoursFlow.Models.Utilisateurs;

public class Etudiant : Utilisateur
{
    public int IdEtudiant { get; set; }

    public required string Matricule { get; set; }
    public required string Niveau { get; set; }
    public string? Groupe { get; set; }

    public int UtilisateurId { get; set; }
    public virtual Utilisateur Utilisateur { get; set; } = default!;

    public int IdFiliere { get; set; }
    public virtual Filiere Filiere { get; set; } = default!;

    // 1 Classe -> * Etudiants
    public int IdClasse { get; set; }
    public virtual Classe Classe { get; set; } = default!;

    public void ConsulterEDT() { }
}