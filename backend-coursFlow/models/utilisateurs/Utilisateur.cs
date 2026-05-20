
namespace BackendCoursFlow.Models.Utilisateurs;

public class Utilisateur
{
    [Key]
    public int Id { get; set; }
    
    [Required, MaxLength(100)]
    public string Nom { get; set; } = string.Empty;
    
    [Required, MaxLength(100)]
    public string Prenom { get; set; } = string.Empty;
    
    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string MotDePasse { get; set; } = string.Empty;
    
    [Phone, MaxLength(20)]
    public string? Telephone { get; set; }
    
    [Required]
    public Role Role { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    public virtual Admin? Admin { get; set; }
    public virtual Responsable? Responsable { get; set; }
    public virtual Professeur? Professeur { get; set; }
    public virtual Etudiant? Etudiant { get; set; }
    
    public bool SeConnecter(string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, MotDePasse);
    }
    
    public void Deconnecter() { }
}