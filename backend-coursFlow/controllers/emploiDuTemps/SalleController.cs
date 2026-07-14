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

}