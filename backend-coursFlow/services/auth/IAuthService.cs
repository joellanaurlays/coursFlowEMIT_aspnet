using Microsoft.IdentityModel.Tokens;
using BackendCoursFlow.Models;
using BackendCoursFlow.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Donnees;

namespace BackendCoursFlow.Services.Auth;

public interface IAuthService
{
    Task<LoginResponse?> Login(LoginRequest request);
    Task<Utilisateur> Register(RegisterRequest request);
    string GenerateJwtToken(Utilisateur user);
    Task<bool> Logout(int userId);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    
    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
    public async Task<LoginResponse?> Login(LoginRequest request)
    {
        var user = await _context.Utilisateurs
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
            
        if (user == null || !user.SeConnecter(request.Password))
            return null;
            
        var token = GenerateJwtToken(user);
        
        return new LoginResponse
        {
            Token = token,
            UserId = user.Id,
            Nom = user.Nom,
            Prenom = user.Prenom,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
    
    public async Task<Utilisateur> Register(RegisterRequest request)
    {
        var existingUser = await _context.Utilisateurs
            .FirstOrDefaultAsync(u => u.Email == request.Email);
            
        if (existingUser != null)
            throw new Exception("Un utilisateur avec cet email existe déjà");
            
        var user = new Utilisateur
        {
            Nom = request.Nom,
            Prenom = request.Prenom,
            Email = request.Email,
            MotDePasse = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Telephone = request.Telephone,
            Role = Enum.Parse<Role>(request.Role),
            IsActive = true
        };
        
        _context.Utilisateurs.Add(user);
        await _context.SaveChangesAsync();
        
        // Créer l'entité correspondante selon le rôle
        switch (user.Role)
        {
            case Role.ADMIN:
                _context.Admins.Add(new Admin { UtilisateurId = user.Id });
                break;
            case Role.RESPONSABLE:
                _context.Responsables.Add(new Responsable { UtilisateurId = user.Id });
                break;
            case Role.PROFESSEUR:
                _context.Professeurs.Add(new Professeur { UtilisateurId = user.Id });
                break;
            case Role.ETUDIANT:
                _context.Etudiants.Add(new Etudiant { UtilisateurId = user.Id });
                break;
        }
        
        await _context.SaveChangesAsync();
        
        return user;
    }
    
    public string GenerateJwtToken(Utilisateur user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? "votre_secret_key_tres_long_et_securise");
        
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("Nom", user.Nom),
            new Claim("Prenom", user.Prenom)
        };
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
    public async Task<bool> Logout(int userId)
    {
        // Implémentation de déconnexion (invalider token si nécessaire)
        // Pour une solution simple, on peut juste retourner true
        // Le frontend supprimera le token localement
        return await Task.FromResult(true);
    }
}
