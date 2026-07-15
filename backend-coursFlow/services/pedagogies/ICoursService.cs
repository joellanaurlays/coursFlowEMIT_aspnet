using BackendCoursFlow.DTOs;

namespace BackendCoursFlow.Services.Pedagogies;

public interface ICoursService
{
    Task<List<CoursDTO>> GetAllCours();

    Task<CoursDTO?> GetCoursById(int id);

    Task<CoursDTO> CreateCours(CreateCoursRequest request);

    Task<bool> UpdateCours(int id, CreateCoursRequest request);

    Task<bool> DeleteCours(int id);
}