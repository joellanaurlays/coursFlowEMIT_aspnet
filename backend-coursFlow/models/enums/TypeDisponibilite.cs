namespace BackendCoursFlow.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TypeDisponibilite
{
    Disponible,
    Indisponible
}