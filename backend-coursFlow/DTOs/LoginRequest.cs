namespace BackendCoursFlow.DTOs;
using System.ComponentModel.DataAnnotations;

public class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

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
