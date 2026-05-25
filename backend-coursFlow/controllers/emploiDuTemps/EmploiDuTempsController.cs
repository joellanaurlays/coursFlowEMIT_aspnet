using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendCoursFlow.Services.EmploiDuTemps;
using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Controllers.EmploiDuTemps;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmploiDuTempsController : ControllerBase
{
    private readonly IEmploiDuTempsService _edtService;
    private readonly ILogger<EmploiDuTempsController> _logger;
    
    public EmploiDuTempsController(IEmploiDuTempsService edtService, ILogger<EmploiDuTempsController> logger)
    {
        _edtService = edtService;
        _logger = logger;
    }
    
    [HttpGet("classe/{classeId}")]
    public async Task<IActionResult> GetEmploiByClasse(int classeId, [FromQuery] string? semaine)
    {
        try
        {
            var emplois = await _edtService.GetEmploiByClasse(classeId, semaine);
            return Ok(emplois);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'EDT par classe");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("professeur/{professeurId}")]
    public async Task<IActionResult> GetEmploiByProfesseur(int professeurId, [FromQuery] string? semaine)
    {
        try
        {
            var emplois = await _edtService.GetEmploiByProfesseur(professeurId, semaine);
            return Ok(emplois);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'EDT par professeur");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("salle/{salleId}")]
    public async Task<IActionResult> GetEmploiBySalle(int salleId, [FromQuery] string? semaine)
    {
        try
        {
            var emplois = await _edtService.GetEmploiBySalle(salleId, semaine);
            return Ok(emplois);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'EDT par salle");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpPost]
    [Authorize(Roles = "ADMIN,RESPONSABLE")]
    public async Task<IActionResult> CreateEmploi([FromBody] CreateEmploiDuTempsRequest request)
    {
        try
        {
            var emploi = await _edtService.CreateEmploi(request);
            return CreatedAtAction(nameof(GetEmploiByClasse), new { classeId = emploi.Classe.IdClasse }, emploi);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de l'EDT");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN,RESPONSABLE")]
    public async Task<IActionResult> UpdateEmploi(int id, [FromBody] CreateEmploiDuTempsRequest request)
    {
        try
        {
            var result = await _edtService.UpdateEmploi(id, request);
            if (!result)
                return NotFound(new { message = "Emploi du temps non trouvé" });
                
            return Ok(new { message = "Emploi du temps mis à jour avec succès" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour de l'EDT");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN,RESPONSABLE")]
    public async Task<IActionResult> DeleteEmploi(int id)
    {
        try
        {
            var result = await _edtService.DeleteEmploi(id);
            if (!result)
                return NotFound(new { message = "Emploi du temps non trouvé" });
                
            return Ok(new { message = "Emploi du temps supprimé avec succès" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de l'EDT");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("verifier-conflit")]
    public async Task<IActionResult> VerifierConflit([FromQuery] CreateEmploiDuTempsRequest request)
    {
        try
        {
            var hasConflict = await _edtService.VerifierConflit(request);
            return Ok(new { hasConflict });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la vérification des conflits");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("exporter/{classeId}")]
    public async Task<IActionResult> ExporterEmploiPDF(int classeId, [FromQuery] string periode)
    {
        try
        {
            var pdfBytes = await _edtService.ExporterEmploiPDF(classeId, periode);
            return File(pdfBytes, "application/pdf", $"EDT_Classe_{classeId}_{periode}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'export PDF");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
}