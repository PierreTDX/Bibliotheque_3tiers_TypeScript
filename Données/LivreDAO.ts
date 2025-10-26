import { Database } from 'better-sqlite3';
import { ConnexionBD } from './ConnexionBD';
import { Livre } from '../Modèles/Livre';

interface LivreRow {
  isbn: string;
  titre: string;
  auteur: string;
  annee: number;
  disponible: number;
}

export class LivreDAO {
  private db: Database;

  constructor() {
    this.db = new ConnexionBD('./bibliotheque.db').obtenirConnexion();
  }

  creer(livre: Livre): boolean {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO livres (isbn, titre, auteur, annee, disponible) VALUES (?, ?, ?, ?, ?)'
      );
      stmt.run(
        livre.isbn,
        livre.titre,
        livre.auteur,
        livre.annee,
        livre.disponible ? 1 : 0
      );
      return true;
    } catch (e) {
      console.error('Erreur lors de la création du livre :', e);
      return false;
    }
  }

  trouverTous(): Livre[] {
    const rows = this.db.prepare('SELECT * FROM livres').all() as LivreRow[];
    return rows.map(r => {
      const livre = new Livre(r.isbn, r.titre, r.auteur, r.annee);
      livre.disponible = r.disponible === 1;
      return livre;
    });
  }

  trouverParISBN(isbn: string): Livre | null {
    const r = this.db
      .prepare('SELECT * FROM livres WHERE isbn = ?')
      .get(isbn) as LivreRow | undefined;

    if (!r) return null;

    const livre = new Livre(r.isbn, r.titre, r.auteur, r.annee);
    livre.disponible = r.disponible === 1;
    return livre;
  }

  mettreAJourDisponibilite(isbn: string, disponible: boolean): boolean {
    try {
      const valeur = disponible ? 1 : 0;
      const res = this.db
        .prepare('UPDATE livres SET disponible = ? WHERE isbn = ?')
        .run(valeur, isbn);
      return res.changes > 0;
    } catch (e) {
      console.error('Erreur lors de la mise à jour de la disponibilité :', e);
      return false;
    }
  }

  supprimer(isbn: string): boolean {
    try {
      const res = this.db.prepare('DELETE FROM livres WHERE isbn = ?').run(isbn);
      return res.changes > 0;
    } catch (e) {
      console.error('Erreur lors de la suppression du livre :', e);
      return false;
    }
  }
}