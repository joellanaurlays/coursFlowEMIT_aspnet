namespace BackendCoursFlow.DTOs;

public class FiliereDTO
{
    public int IdFiliere { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class CreateFiliereRequest
{
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}