namespace BackendCoursFlow.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TypeSalle
{
    Amphi,
    Labo
}