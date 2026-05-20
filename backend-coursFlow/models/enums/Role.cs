namespace BackendCoursFlow.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Role
{
    ADMIN,
    RESPONSABLE,
    PROFESSEUR,
    ETUDIANT
}
