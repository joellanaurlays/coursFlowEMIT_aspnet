using BackendCoursFlow.Models.EmploiDuTemps;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Services.EmploiDuTemps;
namespace BackendCoursFlow.Controllers.EmploiDuTemps;

[ApiController]
[Route("api/[controller]")]
public class DisponibiliteController : ControllerBase
{
    private readonly DisponibiliteService _dispoService;

    public DisponibiliteController(DisponibiliteService dispoService)
	{
		_dispoService = dispoService;		
	}

	// GET
	[HttpGet("professeur/{profId}")]
	public async Task<ActionResult<List<DisponibiliteDTOs>>> GetByProf(int profId)
	{
		var dispo = await _dispoService.GetByProfesseurAsync(profId);
		return Ok(dispo);
	}

	// POST
	[HttpPost("professeur/{profId}")]
	public async Task<IActionResult> Create(int profId, [FromBody] CreateDisponibiliteRequest dispo)
	{
		var success = await _dispoService.CreateDisponibiliteAsync(dispo, profId);

		if (!success)
		{
			return BadRequest("Le professeur a déjà un créneau qui chevauche cette période.");
		}

		return Ok(new { message = "Disponibilité ajoutée avec succès" });
	}
	
	// DELETE
	[HttpDelete("{id}")]
	public async Task<IActionResult> Delete(int id)
	{
		await _dispoService.DeleteDisponibiliteAsync(id);
		return NoContent();
	}
}
