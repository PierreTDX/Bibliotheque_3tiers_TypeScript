import { Livre } from '../Modèles/Livre';
import { LivreDAO } from '../Données/LivreDAO';

type Statistiques = {
  total: number;
  disponibles: number;
  empruntes: number;
  tauxEmprunt: number;
};

export class ServiceBibliotheque {
  livreDAO: LivreDAO;

  constructor() {
    this.livreDAO = new LivreDAO();
  }

  ajouterLivre(
    isbn: string,
    titre: string,
    auteur: string,
    annee: number
  ): { succes: boolean; messages: string[] } {
    const messages: string[] = [];
    const anneeActuelle = new Date().getFullYear();

    if (!isbn || isbn.length < 10)
      messages.push('ISBN invalide (minimum 10 caractères)');
    if (!titre) messages.push('Le titre est obligatoire');
    if (!auteur) messages.push("L'auteur est obligatoire");
    if (!Number.isInteger(annee) || annee < 1000 || annee > anneeActuelle)
      messages.push(`Année invalide (entre 1000 et ${anneeActuelle})`);

    if (this.livreDAO.trouverParISBN(isbn)) messages.push('Ce livre existe déjà');

    if (messages.length === 0) {
      const livre = new Livre(isbn, titre, auteur, annee);
      const ok = this.livreDAO.creer(livre);
      if (ok) messages.push('Livre ajouté avec succès');
      else messages.push("Erreur lors de l'ajout du livre");
      return { succes: ok, messages };
    }

    return { succes: false, messages };
  }

  obtenirTousLesLivres(): { succes: boolean; messages: string[]; payload: Livre[] } {
    const livres = this.livreDAO.trouverTous();
    if (livres.length === 0)
      return { succes: false, messages: ['La bibliothèque est vide'], payload: [] };
    return { succes: true, messages: [], payload: livres };
  }

  obtenirLivresDisponibles(): { succes: boolean; messages: string[]; payload: Livre[] } {
    const livres = this.livreDAO.trouverTous().filter(l => l.disponible);
    if (livres.length === 0)
      return { succes: false, messages: ['Aucun livre disponible'], payload: [] };
    return { succes: true, messages: [], payload: livres };
  }

  rechercherLivre(isbn: string): { succes: boolean; messages: string[]; payload?: Livre } {
    const livre = this.livreDAO.trouverParISBN(isbn);
    if (!livre) return { succes: false, messages: ['Livre non trouvé'] };
    return { succes: true, messages: ['Livre trouvé'], payload: livre };
  }

  emprunterLivre(isbn: string): { succes: boolean; messages: string[] } {
    const livre = this.livreDAO.trouverParISBN(isbn);
    if (!livre) return { succes: false, messages: ['Livre inexistant'] };
    if (!livre.disponible) return { succes: false, messages: ['Livre déjà emprunté'] };
    const ok = this.livreDAO.mettreAJourDisponibilite(isbn, false);
    return {
      succes: ok,
      messages: ok ? ['Livre emprunté avec succès'] : ["Erreur lors de l'emprunt"]
    };
  }

  retournerLivre(isbn: string): { succes: boolean; messages: string[] } {
    const livre = this.livreDAO.trouverParISBN(isbn);
    if (!livre) return { succes: false, messages: ['Livre inexistant'] };
    if (livre.disponible) return { succes: false, messages: ["Ce livre n'est pas emprunté"] };
    const ok = this.livreDAO.mettreAJourDisponibilite(isbn, true);
    return {
      succes: ok,
      messages: ok ? ['Livre retourné avec succès'] : ['Erreur lors du retour']
    };
  }

  obtenirStatistiques(): { succes: boolean; messages: string[]; payload: Statistiques } {
    const livres = this.livreDAO.trouverTous();
    const total = livres.length;
    const disponibles = livres.filter(l => l.disponible).length;
    const empruntes = total - disponibles;
    const tauxEmprunt = total > 0 ? (empruntes / total) * 100 : 0;
    return { succes: true, messages: [], payload: { total, disponibles, empruntes, tauxEmprunt } };
  }

  rechercherParAuteur(auteur: string): { succes: boolean; messages: string[]; payload: Livre[] } {
    if (!auteur.trim()) {
      return { succes: false, messages: ['Veuillez renseigner un auteur ou un fragment'], payload: [] };
    }

    const results = this.livreDAO.trouverTous().filter(
      l => l.auteur.toLowerCase().includes(auteur.toLowerCase())
    );

    if (results.length === 0)
      return { succes: false, messages: ['Aucun résultat trouvé'], payload: [] };
    return { succes: true, messages: [], payload: results };
  }
}