using System.ComponentModel.DataAnnotations;
namespace BackendCoursFlow.DTOs.Auth;

public class RegisterRequest
{
    [Required, MaxLength(100)]
    public string Nom { get; set; } = string.Empty;
    
    [Required, MaxLength(100)]
    public string Prenom { get; set; } = string.Empty;
    
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    [Phone]
    public string? Telephone { get; set; }
    
    [Required]
    public string Role { get; set; } = string.Empty;
}