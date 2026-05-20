namespace backendCoursFlow.DTOs;

public class DisponibiliteDTOs
{
    public int IdDispo { get; set; }
    public string Jour { get; set; } = string.Empty;
    public string HeureDebut { get; set; } = string.Empty;
    public string HeureFin { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int ProfesseurId { get; set; }
    public string ProfesseurNom { get; set; } = string.Empty;
}

public class CreateDisponibiliteRequest
{
    public string Jour { get; set; } = string.Empty;
    public string HeureDebut { get; set; } = string.Empty;
    public string HeureFin { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}
