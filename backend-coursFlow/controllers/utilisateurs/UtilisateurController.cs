using Microsoft.AspNetCore.Mvc;
using BackendCoursFlow.Services;
using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Controllers.utilisateurs;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class UtilisateurController : ControllerBase
{
    private readonly IUtilisateurService _utilisateurService;
    private readonly ILogger<UtilisateurController> _logger;
    
    public UtilisateurController(IUtilisateurService utilisateurService, ILogger<UtilisateurController> logger)
    {
        _utilisateurService = utilisateurService;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAllUtilisateurs()
    {
        try
        {
            var utilisateurs = await _utilisateurService.GetAllUtilisateurs();
            return Ok(utilisateurs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des utilisateurs");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUtilisateurById(int id)
    {
        try
        {
            var utilisateur = await _utilisateurService.GetUtilisateurById(id);
            if (utilisateur == null)
                return NotFound(new { message = "Utilisateur non trouvé" });
                
            return Ok(utilisateur);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'utilisateur");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateUtilisateur([FromBody] CreateUtilisateurRequest request)
    {
        try
        {
            var utilisateur = await _utilisateurService.CreateUtilisateur(request);
            return CreatedAtAction(nameof(GetUtilisateurById), new { id = utilisateur.Id }, utilisateur);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de l'utilisateur");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUtilisateur(int id, [FromBody] UpdateUtilisateurRequest request)
    {
        try
        {
            var result = await _utilisateurService.UpdateUtilisateur(id, request);
            if (!result)
                return NotFound(new { message = "Utilisateur non trouvé" });
                
            return Ok(new { message = "Utilisateur mis à jour avec succès" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour de l'utilisateur");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUtilisateur(int id)
    {
        try
        {
            var result = await _utilisateurService.DeleteUtilisateur(id);
            if (!result)
                return NotFound(new { message = "Utilisateur non trouvé" });
                
            return Ok(new { message = "Utilisateur supprimé avec succès" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de l'utilisateur");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("role/{role}")]
    public async Task<IActionResult> GetUtilisateursByRole(string role)
    {
        try
        {
            var utilisateurs = await _utilisateurService.GetUtilisateursByRole(role);
            return Ok(utilisateurs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des utilisateurs par rôle");
            return BadRequest(new { message = "Rôle invalide" });
        }
    }
}