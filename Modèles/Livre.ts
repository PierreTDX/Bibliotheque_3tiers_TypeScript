export class Livre {
  isbn: string;
  titre: string;
  auteur: string;
  annee: number;
  disponible: boolean;

  constructor(isbn: string, titre: string, auteur: string, annee: number) {
    this.isbn = isbn;
    this.titre = titre;
    this.auteur = auteur;
    this.annee = annee;
    this.disponible = true;
  }

  afficherInfo(): string {
    const statut = this.disponible ? "Disponible" : "Emprunté";
    return `${this.titre} par ${this.auteur} (${this.annee}) - ${statut}`;
  }
}
