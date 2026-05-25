using BackendCoursFlow.Services.Utilisateurs;
using BackendCoursFlow.DTOs;
namespace BackendCoursFlow.Controllers.Utilisateurs;

[ApiController]
[Route("api/[controller]")]
public class EtudiantController : ControllerBase
{
    private readonly IUtilisateurService _etudiantService;

    public EtudiantController(IUtilisateurService etudiantService)
    {
        _etudiantService = etudiantService;
    }

    // GET: api/Etudiant
    [HttpGet]
    public async Task<ActionResult<List<UtilisateurDTO>>> GetAll()
    {
        var etudiants = await _etudiantService.GetAllEtudiantsAsync();
        return Ok(etudiants);
    }

    // GET: api/Etudiant/5
    [HttpGet("{id}")]
    public async Task<ActionResult<UtilisateurDTO>> GetById(int id)
    {
        var etudiant = await _etudiantService.GetEtudiantByIdAsync(id);

        if (etudiant == null)
        {
            return NotFound(new { message = $"L'étudiant avec l'ID {id} n'a pas été trouvé." });
        }

        return Ok(etudiant);
    }

    // POST: api/Etudiant
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateUtilisateurRequest userRequest,
        [FromQuery] string matricule,
        [FromQuery] string niveau,
        [FromQuery] int idFiliere,
        [FromQuery] int idClasse,
        [FromQuery] string? groupe = null)
    {
        await _etudiantService.CreateEtudiantWithDtoAsync(userRequest, matricule, niveau, groupe, idFiliere, idClasse);
        return Ok(new { message = "Étudiant et compte utilisateur créés avec succès." });
    }

    // DELETE: api/Etudiant/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _etudiantService.DeleteEtudiantAsync(id);
        return NoContent();
    }
}