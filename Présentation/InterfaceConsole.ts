import * as readline from 'readline';
import { ServiceBibliotheque } from '../Métier/ServiceBibliotheque';

const service = new ServiceBibliotheque();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function question(q: string): Promise<string> {
  return new Promise(res => rl.question(q, ans => res(ans.trim())));
}

async function main() {
  while (true) {
    console.log('\n========================================');
    console.log('  SYSTÈME DE GESTION DE BIBLIOTHÈQUE');
    console.log('========================================');
    console.log('1. Ajouter un livre');
    console.log('2. Afficher tous les livres');
    console.log('3. Afficher livres disponibles');
    console.log('4. Rechercher un livre (ISBN)');
    console.log('5. Emprunter un livre');
    console.log('6. Retourner un livre');
    console.log('7. Statistiques');
    console.log('8. Rechercher par auteur');
    console.log('9. Quitter');
    console.log('========================================');

    const choix = await question('> ');
    switch (choix) {
      case '1': await ajouterLivre(); break;
      case '2': await afficherTous(); break;
      case '3': await afficherDisponibles(); break;
      case '4': await rechercher(); break;
      case '5': await emprunter(); break;
      case '6': await retourner(); break;
      case '7': await afficherStats(); break;
      case '8': await rechercherParAuteur(); break;
      case '9': console.log('\n👋 Au revoir !\n'); rl.close(); process.exit(0);
      default: console.log('\n❌ Choix invalide');
    }
  }
}

async function attendreEnter() {
  await question('\nAppuyez sur Entrée pour revenir au menu...');
}


async function ajouterLivre() {
  console.log('\n--- AJOUTER UN LIVRE ---');

  const isbn = await question('ISBN : ');
  const titre = await question('Titre : ');
  const auteur = await question('Auteur : ');
  const anneeStr = await question('Année de publication : ');
  const annee = parseInt(anneeStr, 10);

  const res = service.ajouterLivre(isbn, titre, auteur, annee);
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  await attendreEnter();
}

async function afficherTous() {
  console.log('\n--- TOUS LES LIVRES ---');

  const res = service.obtenirTousLesLivres();
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  if (res.succes)
    res.payload.forEach((l, i) => console.log(`${i + 1}. ${l.afficherInfo()}`));
  await attendreEnter();
}

async function afficherDisponibles() {
  console.log('\n--- LIVRES DISPONIBLES ---');

  const res = service.obtenirLivresDisponibles();
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  if (res.succes)
    res.payload.forEach((l, i) => console.log(`${i + 1}. ${l.afficherInfo()}`));
  await attendreEnter();
}

async function rechercher() {
  console.log('\n--- RECHERCHER UN LIVRE ---');

  const isbn = await question('ISBN : ');
  const res = service.rechercherLivre(isbn);
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  if (res.succes) console.log(res.payload!.afficherInfo());
  await attendreEnter();
}

async function emprunter() {
  const isbn = await question('\nISBN du livre à emprunter : ');
  const res = service.emprunterLivre(isbn);
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  await attendreEnter();
}

async function retourner() {
  const isbn = await question('\nISBN du livre à retourner : ');
  const res = service.retournerLivre(isbn);
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  await attendreEnter();
}

async function afficherStats() {
  console.log('\n--- STATISTIQUES ---');

  const res = service.obtenirStatistiques();
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  console.log(res.payload);
  await attendreEnter();
}

async function rechercherParAuteur() {
  const auteur = await question('\n Auteur (ou fragment) : ');
  const res = service.rechercherParAuteur(auteur);
  res.messages.forEach(msg =>
    console.log(res.succes ? `✅ ${msg}` : `❌ ${msg}`)
  );
  if (res.succes)
    res.payload.forEach((l, i) => console.log(`${i + 1}. ${l.afficherInfo()}`));
  await attendreEnter();
}

main();