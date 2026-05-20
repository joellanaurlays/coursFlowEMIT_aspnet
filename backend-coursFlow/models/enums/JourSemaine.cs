namespace BackendCoursFlow.Models.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum JourSemaine
{
    Lundi,
    Mardi,
    Mercredi,
    Jeudi,
    Vendredi,
    Samedi,
    Dimanche
}