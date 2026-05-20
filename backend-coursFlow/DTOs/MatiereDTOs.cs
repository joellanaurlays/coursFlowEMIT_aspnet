namespace BackendCoursFlow.DTOs;

public class MatiereDTOs
{
    public int IdMatiere { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Credits { get; set; }
    public int VolumeHoraireGlobal { get; set; }
    public List<int>? PreRequisIds { get; set; }
}

public class CreateMatiereRequest
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Credits { get; set; }
    public int VolumeHoraireGlobal { get; set; }
    public List<int>? PreRequisIds { get; set; }
}
