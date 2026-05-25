using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace coursFlow.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Filieres",
                columns: table => new
                {
                    IdFiliere = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filieres", x => x.IdFiliere);
                });

            migrationBuilder.CreateTable(
                name: "Salles",
                columns: table => new
                {
                    IdSalle = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Batiment = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Capacite = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    EstDisponible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Salles", x => x.IdSalle);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    IdClasse = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "text", nullable: false),
                    Niveau = table.Column<string>(type: "text", nullable: false),
                    Groupe = table.Column<string>(type: "text", nullable: false),
                    IdFiliere = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.IdClasse);
                    table.ForeignKey(
                        name: "FK_Classes_Filieres_IdFiliere",
                        column: x => x.IdFiliere,
                        principalTable: "Filieres",
                        principalColumn: "IdFiliere",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DisponibilitesSalles",
                columns: table => new
                {
                    IdDispoSalle = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Jour = table.Column<int>(type: "integer", nullable: false),
                    HeureDebut = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HeureFin = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    DateDebut = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateFin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SalleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DisponibilitesSalles", x => x.IdDispoSalle);
                    table.ForeignKey(
                        name: "FK_DisponibilitesSalles_Salles_SalleId",
                        column: x => x.SalleId,
                        principalTable: "Salles",
                        principalColumn: "IdSalle",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Prenom = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MotDePasse = table.Column<string>(type: "text", nullable: false),
                    Telephone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Discriminator = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false),
                    IdEtudiant = table.Column<int>(type: "integer", nullable: true),
                    Matricule = table.Column<string>(type: "text", nullable: true),
                    Niveau = table.Column<string>(type: "text", nullable: true),
                    Groupe = table.Column<string>(type: "text", nullable: true),
                    Etudiant_UtilisateurId = table.Column<int>(type: "integer", nullable: true),
                    IdFiliere = table.Column<int>(type: "integer", nullable: true),
                    FiliereIdFiliere = table.Column<int>(type: "integer", nullable: true),
                    IdClasse = table.Column<int>(type: "integer", nullable: true),
                    ClasseIdClasse = table.Column<int>(type: "integer", nullable: true),
                    IdProf = table.Column<int>(type: "integer", nullable: true),
                    Grade = table.Column<string>(type: "text", nullable: true),
                    Specialite = table.Column<string>(type: "text", nullable: true),
                    Professeur_UtilisateurId = table.Column<int>(type: "integer", nullable: true),
                    UtilisateurId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Classes_ClasseIdClasse",
                        column: x => x.ClasseIdClasse,
                        principalTable: "Classes",
                        principalColumn: "IdClasse",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Filieres_FiliereIdFiliere",
                        column: x => x.FiliereIdFiliere,
                        principalTable: "Filieres",
                        principalColumn: "IdFiliere",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Utilisateurs_Etudiant_UtilisateurId",
                        column: x => x.Etudiant_UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Utilisateurs_Professeur_UtilisateurId",
                        column: x => x.Professeur_UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Utilisateurs_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    IdAdmin = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UtilisateurId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.IdAdmin);
                    table.ForeignKey(
                        name: "FK_Admins_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Disponibilites",
                columns: table => new
                {
                    IdDispo = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Jour = table.Column<int>(type: "integer", nullable: false),
                    HeureDebut = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HeureFin = table.Column<TimeSpan>(type: "interval", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IdProf = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disponibilites", x => x.IdDispo);
                    table.ForeignKey(
                        name: "FK_Disponibilites_Utilisateurs_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Matieres",
                columns: table => new
                {
                    IdMatiere = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Nom = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Credits = table.Column<int>(type: "integer", nullable: false),
                    VolumeHoraireGlobal = table.Column<int>(type: "integer", nullable: false),
                    ResponsableId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matieres", x => x.IdMatiere);
                    table.ForeignKey(
                        name: "FK_Matieres_Utilisateurs_ResponsableId",
                        column: x => x.ResponsableId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Cours",
                columns: table => new
                {
                    IdCours = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AnneeUniversitaire = table.Column<string>(type: "text", nullable: false),
                    Semestre = table.Column<string>(type: "text", nullable: false),
                    Duree = table.Column<int>(type: "integer", nullable: false),
                    VolumeHoraire = table.Column<int>(type: "integer", nullable: false),
                    MatiereId = table.Column<int>(type: "integer", nullable: false),
                    ProfesseurId = table.Column<int>(type: "integer", nullable: false),
                    SalleId = table.Column<int>(type: "integer", nullable: true),
                    ClasseIdClasse = table.Column<int>(type: "integer", nullable: true),
                    ResponsableId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cours", x => x.IdCours);
                    table.ForeignKey(
                        name: "FK_Cours_Classes_ClasseIdClasse",
                        column: x => x.ClasseIdClasse,
                        principalTable: "Classes",
                        principalColumn: "IdClasse");
                    table.ForeignKey(
                        name: "FK_Cours_Matieres_MatiereId",
                        column: x => x.MatiereId,
                        principalTable: "Matieres",
                        principalColumn: "IdMatiere",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Cours_Salles_SalleId",
                        column: x => x.SalleId,
                        principalTable: "Salles",
                        principalColumn: "IdSalle");
                    table.ForeignKey(
                        name: "FK_Cours_Utilisateurs_ProfesseurId",
                        column: x => x.ProfesseurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Cours_Utilisateurs_ResponsableId",
                        column: x => x.ResponsableId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PreRequis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MatiereId = table.Column<int>(type: "integer", nullable: false),
                    MatierePrerequisId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreRequis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PreRequis_Matieres_MatiereId",
                        column: x => x.MatiereId,
                        principalTable: "Matieres",
                        principalColumn: "IdMatiere",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PreRequis_Matieres_MatierePrerequisId",
                        column: x => x.MatierePrerequisId,
                        principalTable: "Matieres",
                        principalColumn: "IdMatiere",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmploisDuTemps",
                columns: table => new
                {
                    IdEmploi = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Jour = table.Column<int>(type: "integer", nullable: false),
                    HeureDebut = table.Column<TimeSpan>(type: "interval", nullable: false),
                    HeureFin = table.Column<TimeSpan>(type: "interval", nullable: false),
                    DateDebut = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateFin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CoursId = table.Column<int>(type: "integer", nullable: false),
                    ClasseId = table.Column<int>(type: "integer", nullable: false),
                    ResponsableId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmploisDuTemps", x => x.IdEmploi);
                    table.ForeignKey(
                        name: "FK_EmploisDuTemps_Classes_ClasseId",
                        column: x => x.ClasseId,
                        principalTable: "Classes",
                        principalColumn: "IdClasse",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmploisDuTemps_Cours_CoursId",
                        column: x => x.CoursId,
                        principalTable: "Cours",
                        principalColumn: "IdCours",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmploisDuTemps_Utilisateurs_ResponsableId",
                        column: x => x.ResponsableId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admins_UtilisateurId",
                table: "Admins",
                column: "UtilisateurId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Classes_IdFiliere",
                table: "Classes",
                column: "IdFiliere");

            migrationBuilder.CreateIndex(
                name: "IX_Cours_ClasseIdClasse",
                table: "Cours",
                column: "ClasseIdClasse");

            migrationBuilder.CreateIndex(
                name: "IX_Cours_MatiereId",
                table: "Cours",
                column: "MatiereId");

            migrationBuilder.CreateIndex(
                name: "IX_Cours_ProfesseurId",
                table: "Cours",
                column: "ProfesseurId");

            migrationBuilder.CreateIndex(
                name: "IX_Cours_ResponsableId",
                table: "Cours",
                column: "ResponsableId");

            migrationBuilder.CreateIndex(
                name: "IX_Cours_SalleId",
                table: "Cours",
                column: "SalleId");

            migrationBuilder.CreateIndex(
                name: "IX_Disponibilites_IdProf",
                table: "Disponibilites",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_DisponibilitesSalles_SalleId",
                table: "DisponibilitesSalles",
                column: "SalleId");

            migrationBuilder.CreateIndex(
                name: "IX_EmploisDuTemps_ClasseId",
                table: "EmploisDuTemps",
                column: "ClasseId");

            migrationBuilder.CreateIndex(
                name: "IX_EmploisDuTemps_CoursId",
                table: "EmploisDuTemps",
                column: "CoursId");

            migrationBuilder.CreateIndex(
                name: "IX_EmploisDuTemps_ResponsableId",
                table: "EmploisDuTemps",
                column: "ResponsableId");

            migrationBuilder.CreateIndex(
                name: "IX_Matieres_Code",
                table: "Matieres",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matieres_ResponsableId",
                table: "Matieres",
                column: "ResponsableId");

            migrationBuilder.CreateIndex(
                name: "IX_PreRequis_MatiereId",
                table: "PreRequis",
                column: "MatiereId");

            migrationBuilder.CreateIndex(
                name: "IX_PreRequis_MatierePrerequisId",
                table: "PreRequis",
                column: "MatierePrerequisId");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_ClasseIdClasse",
                table: "Utilisateurs",
                column: "ClasseIdClasse");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Email",
                table: "Utilisateurs",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Etudiant_UtilisateurId",
                table: "Utilisateurs",
                column: "Etudiant_UtilisateurId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_FiliereIdFiliere",
                table: "Utilisateurs",
                column: "FiliereIdFiliere");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Matricule",
                table: "Utilisateurs",
                column: "Matricule",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Professeur_UtilisateurId",
                table: "Utilisateurs",
                column: "Professeur_UtilisateurId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_UtilisateurId",
                table: "Utilisateurs",
                column: "UtilisateurId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "Disponibilites");

            migrationBuilder.DropTable(
                name: "DisponibilitesSalles");

            migrationBuilder.DropTable(
                name: "EmploisDuTemps");

            migrationBuilder.DropTable(
                name: "PreRequis");

            migrationBuilder.DropTable(
                name: "Cours");

            migrationBuilder.DropTable(
                name: "Matieres");

            migrationBuilder.DropTable(
                name: "Salles");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Filieres");
        }
    }
}
