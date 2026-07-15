using Microsoft.EntityFrameworkCore;
using BackendCoursFlow.Donnees;

using BackendCoursFlow.Services.EmploiDuTemps;
using BackendCoursFlow.Services.Utilisateurs;
using BackendCoursFlow.Services.Auth;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);


// Controllers
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Services Emploi du temps
builder.Services.AddScoped<ClasseService>();

builder.Services.AddScoped<FiliereService>();

builder.Services.AddScoped<DisponibiliteService>();

builder.Services.AddScoped<IMatiereService, MatiereService>();


// Services Utilisateurs
builder.Services.AddScoped<ProfesseurService>();

builder.Services.AddScoped<IUtilisateurService, UtilisateurService>();


// Services Auth
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)
        )
    };
});


// PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});


// CORS Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});



var app = builder.Build();


// ==========================
// Swagger
// ==========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ==========================
// Middlewares
// ==========================


// Désactivé car tu utilises HTTP : localhost:5186
// app.UseHttpsRedirection();


app.UseCors("AllowNextJs");


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();



// Création DB
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    dbContext.Database.EnsureCreated();
}

app.Run();