using EDTBackend.Services;
using EDTBackend.DTOs;

namespace BackendCoursFlow.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    
    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _authService.Login(request);
            if (response == null)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });
                
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la connexion");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var user = await _authService.Register(request);
            return Ok(new { message = "Utilisateur créé avec succès", userId = user.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'inscription");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // Le token est géré côté client
        return Ok(new { message = "Déconnecté avec succès" });
    }
}