using Microsoft.EntityFrameworkCore; 
using BackendCoursFlow.Donnees;
using BackendCoursFlow.Services.Utilisateurs;
using BackendCoursFlow.Services.EmploiDuTemps;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<EtudiantService>();
builder.Services.AddScoped<ProfesseurService>();
builder.Services.AddScoped<ClasseService>();
builder.Services.AddScoped<DisponibiliteService>();
builder.Services.AddScoped<FiliereService>();
builder.Services.AddScoped<IAuthService>();
builder.Services.AddScoped<IEmploiDuTempsService>();
builder.Services.AddScoped<IMatiereService>();

// Enregistrement des controlleur + detournement des cycle de navigation
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

app.MapControllers(); // Reconnaissance des controller par l'app

// Configure the HTTP request pipeline.
/*if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}*/
app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.Run();

