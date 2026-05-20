using Microsoft.AspNetCore.Mvc;
using BackendCoursFlow.Services.EmploiDuTemps;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.EmploiDuTemps;

namespace BackendCoursFlow.Controllers.EmploiDuTemps;

[ApiController]
[Route("api/[controller]")]
public class FiliereController : ControllerBase
{
    private readonly FiliereService _filiereService;

    public FiliereController(FiliereService filiereService)
    {
        _filiereService = filiereService;
    }

    // GET: api/Filiere
    [HttpGet]
    public async Task<ActionResult<List<FiliereDTO>>> GetAll()
    {
        var filieres = await _filiereService.GetAllFilieresAsync();
        return Ok(filieres);
    }

    // GET: api/Filiere/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FiliereDTO>> GetById(int id)
    {
        var filiere = await _filiereService.GetFiliereByIdAsync(id);

        if (filiere == null)
        {
            return NotFound($"La filière avec l'ID {id} n'a pas été trouvée.");
        }

        return Ok(filiere);
    }

    // POST: api/Filiere
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFiliereRequest request)
    {
        var nouvelleFiliere = await _filiereService.CreateFiliereAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = nouvelleFiliere.IdFiliere }, nouvelleFiliere);
    }

    // PUT: api/Filiere/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] FiliereDTO filiereDto)
    {
        if (id != filiereDto.IdFiliere)
        {
            return BadRequest("L'ID dans l'URL ne correspond pas à l'ID de l'objet fourni.");
        }

        var updated = await _filiereService.UpdateFiliereAsync(id, filiereDto);
        if (!updated)
        {
            return NotFound($"La filière avec l'ID {id} n'existe pas.");
        }

        return NoContent();
    }

    // DELETE: api/Filiere/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _filiereService.DeleteFiliereAsync(id);
        if (!deleted)
        {
            return NotFound($"La filière avec l'ID {id} n'a pas été trouvée.");
        }

        return NoContent();
    }
}