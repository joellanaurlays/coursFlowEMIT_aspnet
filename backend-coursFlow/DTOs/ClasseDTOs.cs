namespace BackendCoursFlow.DTOs;

public class ClasseDTOs
{
    public int IdClasse { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Niveau { get; set; } = string.Empty;
    public string Groupe { get; set; } = string.Empty;

    public int IdFiliere { get; set; }
    public string NomFiliere { get; set; } = string.Empty;
}

public class CreateClasseRequest
{
    public string Nom { get; set; } = string.Empty;
    public string Niveau { get; set; } = string.Empty;
    public string Groupe { get; set; } = string.Empty;
    public int IdFiliere { get; set; }
}