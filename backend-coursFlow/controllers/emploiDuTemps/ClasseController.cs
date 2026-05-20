using Microsoft.AspNetCore.Mvc;
using BackendCoursFlow.Services.EmploiDuTemps;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Models.EmploiDuTemps;

namespace BackendCoursFlow.Controllers.EmploiDuTemps;

[ApiController]
[Route("api/[controller]")]
public class ClasseController : ControllerBase
{
    private readonly ClasseService _classeService;

    public ClasseController(ClasseService classeService)
    {
        _classeService = classeService;
    }

    // GET: api/Classe
    [HttpGet]
    public async Task<ActionResult<List<ClasseDTOs>>> GetAll()
    {
        var classes = await _classeService.GetAllClassesAsync();

        var result = classes.Select(c => new ClasseDTOs
        {
            IdClasse = c.IdClasse,
            Nom = c.Nom,
            Niveau = c.Niveau,
            Groupe = c.Groupe,
            IdFiliere = c.IdFiliere,
            NomFiliere = c.Filiere?.Nom ?? "Inconnue"
        }).ToList();

        return Ok(result);
    }

    // GET: api/Classe/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Classe>> GetById(int id)
    {
        var classe = await _classeService.GetClasseWithCoursAsync(id);

        if (classe == null)
        {
            return NotFound($"La classe avec l'ID {id} n'existe pas.");
        }
        return Ok(classe);
    }

    // GET: api/Classe/filiere/2
    [HttpGet("filiere/{filiereId}")]
    public async Task<ActionResult<List<ClasseDTOs>>> GetByFiliere(int filiereId)
    {
        var classes = await _classeService.GetClassesByFiliereAsync(filiereId);

        var result = classes.Select(c => new ClasseDTOs
        {
            IdClasse = c.IdClasse,
            Nom = c.Nom,
            Niveau = c.Niveau,
            Groupe = c.Groupe,
            IdFiliere = c.IdFiliere,
            NomFiliere = c.Filiere?.Nom ?? "Inconnue"
        }).ToList();

        return Ok(result);
    }

    // POST: api/Classe
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateClasseRequest request)
    {
        var nouvelleClasse = new Classe
        {
            Nom = request.Nom,
            Niveau = request.Niveau,
            Groupe = request.Groupe,
            IdFiliere = request.IdFiliere
        };

        await _classeService.CreateClasseAsync(nouvelleClasse);

        return CreatedAtAction(nameof(GetById), new { id = nouvelleClasse.IdClasse }, nouvelleClasse);
    }

    // DELETE: api/Classe/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _classeService.DeleteClasseAsync(id);
        return NoContent();
    }
}