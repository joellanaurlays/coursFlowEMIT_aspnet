
namespace BackendCoursFlow.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { 
            message = "API EDT fonctionne correctement!",
            status = "online",
            timestamp = DateTime.UtcNow
        });
    }
    
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy" });
    }
}
