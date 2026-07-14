using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BackendCoursFlow.Services.EmploiDuTemps;
using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Controllers.EmploiDuTemps;

[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class MatiereController : ControllerBase
{
    private readonly IMatiereService _matiereService;
    private readonly ILogger<MatiereController> _logger;
    
    public MatiereController(IMatiereService matiereService, ILogger<MatiereController> logger)
    {
        _matiereService = matiereService;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAllMatieres()
    {
        try
        {
            var matieres = await _matiereService.GetAllMatieres();
            return Ok(matieres);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des matières");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatiereById(int id)
    {
        try
        {
            var matiere = await _matiereService.GetMatiereById(id);
            if (matiere == null)
                return NotFound(new { message = "Matière non trouvée" });
                
            return Ok(matiere);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de la matière");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpPost]
    //[Authorize(Roles = "ADMIN,RESPONSABLE")]
    public async Task<IActionResult> CreateMatiere([FromBody] CreateMatiereRequest request)
    {
        try
        {
            var matiere = await _matiereService.CreateMatiere(request);
            return CreatedAtAction(nameof(GetMatiereById), new { id = matiere.IdMatiere }, matiere);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création de la matière");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPut("{id}")]
    //[Authorize(Roles = "ADMIN,RESPONSABLE")]
    public async Task<IActionResult> UpdateMatiere(int id, [FromBody] CreateMatiereRequest request)
    {
        try
        {
            var result = await _matiereService.UpdateMatiere(id, request);
            if (!result)
                return NotFound(new { message = "Matière non trouvée" });
                
            return Ok(new { message = "Matière mise à jour avec succès" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour de la matière");
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpDelete("{id}")]
    //[Authorize(Roles = "ADMIN,RESPONSABLE")]
    public async Task<IActionResult> DeleteMatiere(int id)
    {
        try
        {
            var result = await _matiereService.DeleteMatiere(id);
            if (!result)
                return NotFound(new { message = "Matière non trouvée" });
                
            return Ok(new { message = "Matière supprimée avec succès" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de la matière");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
    
    [HttpGet("filiere/{filiereId}")]
    public async Task<IActionResult> GetMatieresByFiliere(int filiereId)
    {
        try
        {
            var matieres = await _matiereService.GetMatieresByFiliere(filiereId);
            return Ok(matieres);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des matières par filière");
            return StatusCode(500, new { message = "Erreur interne du serveur" });
        }
    }
}