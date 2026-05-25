using Microsoft.AspNetCore.Mvc;
using BackendCoursFlow.Services.Utilisateurs;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.Utilisateurs;

namespace BackendCoursFlow.Controllers.Utilisateurs;

[ApiController]
[Route("api/[controller]")]
public class ProfesseurController : ControllerBase
{
    private readonly ProfesseurService _professeurService;

    public ProfesseurController(ProfesseurService professeurService)
    {
        _professeurService = professeurService;
    }

    // GET: api/Professeur
    [HttpGet]
    public async Task<ActionResult<List<UtilisateurDTO>>> GetAll()
    {
        var professeurs = await _professeurService.GetAllProfesseursAsync();
        return Ok(professeurs);
    }

    // GET: api/Professeur/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Professeur>> GetDetails(int id)
    {
        var professeur = await _professeurService.GetProfesseurDetailsAsync(id);

        if (professeur == null)
        {
            return NotFound(new { message = $"Le professeur avec l'ID {id} n'existe pas." });
        }

        return Ok(professeur);
    }

    // POST: api/Professeur
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateUtilisateurRequest userRequest,
        [FromQuery] string grade,
        [FromQuery] string specialite)
    {
        // Validation du DTO
        if (userRequest == null) return BadRequest("Les données de l'utilisateur sont manquantes.");

        await _professeurService.CreateProfesseurWithDtoAsync(userRequest, grade, specialite);
        return Ok(new { message = "Professeur et compte utilisateur créés avec succès." });
    }

    // PUT: api/Professeur/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateUtilisateurRequest updateRequest,
        [FromQuery] string? grade = null,
        [FromQuery] string? specialite = null)
    {
        await _professeurService.UpdateProfesseurAsync(id, updateRequest, grade, specialite);
        return NoContent();
    }
}