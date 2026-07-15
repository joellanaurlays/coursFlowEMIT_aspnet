using Microsoft.AspNetCore.Mvc;

namespace BackendCoursFlow.Controllers.EmploiDuTemps;


[ApiController]
[Route("api/[controller]")]
public class SalleController : ControllerBase
{

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(new List<object>());
    }
    
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        return Ok(new { message = "Salle not found" });
    }

    [HttpPost]
    public IActionResult Create()
    {
        return Ok(new { message = "Salle created" });
    }

}