namespace BackendCoursFlow.DTOs;

public class EmploiDuTempsDTOs
{
    public int IdEmploi { get; set; }
    public string Jour { get; set; } = string.Empty;
    public string HeureDebut { get; set; } = string.Empty;
    public string HeureFin { get; set; } = string.Empty;
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    public CoursInfoDTO Cours { get; set; } = null!;
    public ClasseInfoDTO Classe { get; set; } = null!;
}

public class CoursInfoDTO
{
    public int IdCours { get; set; }
    public string MatiereNom { get; set; } = string.Empty;
    public string ProfesseurNom { get; set; } = string.Empty;
    public string TypeCours { get; set; } = string.Empty;
    public string? SalleNom { get; set; }
}

public class ClasseInfoDTO
{
    public int IdClasse { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Niveau { get; set; } = string.Empty;
    public string Groupe { get; set; } = string.Empty;
    public string FiliereNom { get; set; } = string.Empty;
}

public class CreateEmploiDuTempsRequest
{
    public string Jour { get; set; } = string.Empty;
    public string HeureDebut { get; set; } = string.Empty;
    public string HeureFin { get; set; } = string.Empty;
    public DateTime DateDebut { get; set; }
    public DateTime DateFin { get; set; }
    public int CoursId { get; set; }
    public int ClasseId { get; set; }
}
