using System.ComponentModel.DataAnnotations;

namespace BackendCoursFlow.DTOs;

public class CreateCoursRequest
{
    [Required]
    public string AnneeUniversitaire { get; set; } = string.Empty;

    [Required]
    public string Semestre { get; set; } = string.Empty;

    [Required]
    public string TypeCours { get; set; } = string.Empty;

    [Range(1,20)]
    public int Duree { get; set; }

    [Range(1,1000)]
    public int VolumeHoraire { get; set; }

    [Required]
    public int MatiereId { get; set; }

    [Required]
    public int ProfesseurId { get; set; }

    public int? SalleId { get; set; }
}