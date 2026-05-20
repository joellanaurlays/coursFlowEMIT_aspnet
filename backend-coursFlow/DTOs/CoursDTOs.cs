namespace BackendCoursFlow.DTOs;

public class CoursDTOs
{
    public int IdCours { get; set; }
    public string AnneeUniversitaire { get; set; } = string.Empty;
    public string Semestre { get; set; } = string.Empty;
    public string TypeCours { get; set; } = string.Empty;
    public int Duree { get; set; }
    public int VolumeHoraire { get; set; }
    public string MatiereNom { get; set; } = string.Empty;
    public string ProfesseurNom { get; set; } = string.Empty;
    public string? SalleNom { get; set; }
}

public class CreateCoursRequest
{
    public string AnneeUniversitaire { get; set; } = string.Empty;
    public string Semestre { get; set; } = string.Empty;
    public string TypeCours { get; set; } = string.Empty;
    public int Duree { get; set; }
    public int VolumeHoraire { get; set; }
    public int MatiereId { get; set; }
    public int ProfesseurId { get; set; }
    public int? SalleId { get; set; }
}
