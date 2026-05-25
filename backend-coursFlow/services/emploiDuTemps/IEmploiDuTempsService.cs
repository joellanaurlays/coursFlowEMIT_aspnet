using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Services.EmploiDuTemps;

public interface IEmploiDuTempsService
{
    Task<List<EmploiDuTempsDTOs>> GetEmploiByClasse(int classeId, string? semaine = null);
    Task<List<EmploiDuTempsDTOs>> GetEmploiByProfesseur(int professeurId, string? semaine = null);
    Task<List<EmploiDuTempsDTOs>> GetEmploiBySalle(int salleId, string? semaine = null);
    Task<EmploiDuTempsDTOs> CreateEmploi(CreateEmploiDuTempsRequest request);
    Task<bool> UpdateEmploi(int id, CreateEmploiDuTempsRequest request);
    Task<bool> DeleteEmploi(int id);
    Task<bool> VerifierConflit(CreateEmploiDuTempsRequest request, int? excludeId = null);
    Task<byte[]> ExporterEmploiPDF(int classeId, string periode);
}
