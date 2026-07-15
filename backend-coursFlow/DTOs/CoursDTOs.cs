namespace BackendCoursFlow.DTOs;

public class CoursDTO
{
    public int Id { get; set; }

    public string Titre { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int MatiereId { get; set; }

    public string Matiere { get; set; } = string.Empty;
}