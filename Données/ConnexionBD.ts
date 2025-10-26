import Database from 'better-sqlite3';

export class ConnexionBD {
  nomBD: string;
  connexion: Database.Database | null = null; // Initialisation à null

  constructor(nomBD = './bibliotheque.db') {
    this.nomBD = nomBD;
    this.initialiserBD();
  }

  private initialiserBD() {
    this.connexion = new Database(this.nomBD);
    this.connexion.exec(`
      CREATE TABLE IF NOT EXISTS livres (
        isbn TEXT PRIMARY KEY,
        titre TEXT NOT NULL,
        auteur TEXT NOT NULL,
        annee INTEGER,
        disponible INTEGER DEFAULT 1
      );
    `);
  }

  obtenirConnexion() {
    if (!this.connexion) {
      throw new Error('La connexion à la base de données n\'a pas été initialisée.');
    }
    return this.connexion;
  }
}