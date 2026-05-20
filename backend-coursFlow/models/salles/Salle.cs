using System.ComponentModel.DataAnnotations;
using BackendCoursFlow.Models.Enums;
using BackendCoursFlow.Models.Pedagogies;

namespace BackendCoursFlow.Models.Salles;

public class Salle
{
    [Key]
    public int IdSalle { get; set; }
    
    [Required, MaxLength(100)]
    public string Nom { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Batiment { get; set; }
    
    public int Capacite { get; set; }
    
    public TypeSalle Type { get; set; }
    
    public bool EstDisponible { get; set; } = true;
    
    public virtual ICollection<Cours> Cours { get; set; } = new List<Cours>();
    public virtual ICollection<DisponibiliteSalle> Disponibilites { get; set; } = new List<DisponibiliteSalle>();
    
    public void AjouterSalle() { }
    
    public void ModifierSalle() { }
}

