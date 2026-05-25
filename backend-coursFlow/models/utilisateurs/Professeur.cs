using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using BackendCoursFlow.Models.Pedagogies;
using BackendCoursFlow.Models.EmploiDuTemps;
using BackendCoursFlow.Models.Enums;

namespace BackendCoursFlow.Models.Utilisateurs;

public class Professeur : Utilisateur
{
    public int IdProf { get; set; }

    public string Grade { get; set; } = "";
    public string Specialite { get; set; } = "";

    public int UtilisateurId { get; set; }
    public virtual Utilisateur Utilisateur { get; set; } = default!;

    // Relations
    public virtual ICollection<Cours> Cours { get; set; } = new List<Cours>();
    public virtual ICollection<Disponibilite> Disponibilites { get; set; } = new List<Disponibilite>();

    public void AjouterDisponibilite() { }
    public void ConsulterEDT() { }
}