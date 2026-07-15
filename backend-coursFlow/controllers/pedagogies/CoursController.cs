using Microsoft.AspNetCore.Mvc;
using BackendCoursFlow.DTOs;
using BackendCoursFlow.Services.Pedagogies;

namespace BackendCoursFlow.Controllers.Pedagogies;

[ApiController]
[Route("api/[controller]")]
public class CoursController : ControllerBase
{
    private readonly ICoursService _service;

    public CoursController(ICoursService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllCours());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var cours = await _service.GetCoursById(id);

        if (cours == null)
            return NotFound();

        return Ok(cours);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCoursRequest request)
    {
        var cours = await _service.CreateCours(request);

        return Ok(cours);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateCoursRequest request)
    {
        var ok = await _service.UpdateCours(id, request);

        if (!ok)
            return NotFound();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteCours(id);

        if (!ok)
            return NotFound();

        return Ok();
    }
}