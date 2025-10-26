# Bibliothèque - Architecture 3-tiers (TypeScript / Node.js)

## Structure du projet

```
bibliotheque-3tiers/
├── Présentation/
│   ├── InterfaceConsole.ts
│   └── InterfaceWeb (future)
├── Métier/
│   └── ServiceBibliotheque.ts
├── Données/
│   ├── ConnexionBD.ts
│   └── LivreDAO.ts
└── Modèles/
    └── Livre.ts
```

## ⚙️ Installation

### 1. Initialiser le projet

Dans le dossier racine :

```bash
npm install
```

## ▶️ Exécution du programme

Lancer le programme principal :

```bash
nmp start
ou
npx ts-node Présentation/InterfaceConsole.ts
```
Une interface console s'ouvre :

```
========================================
  SYSTÈME DE GESTION DE BIBLIOTHÈQUE
========================================
1. Ajouter un livre
2. Afficher tous les livres
3. Afficher livres disponibles
4. Rechercher un livre (ISBN)
5. Emprunter un livre
6. Retourner un livre
7. Statistiques
8. Rechercher par auteur
9. Quitter
========================================
>
```
## 💾 Fonctionnement

- Les données sont stockées dans un fichier SQLite local : `bibliotheque.db`.
- Les opérations CRUD sont gérées par `LivreDAO.ts`. (Data Access Object)
- La logique métier (validation ISBN, année, etc.) est gérée par `ServiceBibliotheque.ts`.
- L'écran d'interface est gérée par `InterfaceConsole.ts`. ✅ Couplage réduit

## 💡 Les + de la version 3-tiers

- ✅ Logique métier séparée dans `ServiceBibliotheque`.
- ✅ Plus modulable : couche métier indépendante.
- ✅ Modularité pour les tests : Plus facile, couches séparées.

## 💡 Les limtes de cette version

- ❌ Toujours pas de gestion d’utilisateur ou de permissions (tout le monde peut emprunter/retourner).
- ❌ Pas de suppression de livre.
- ❌ Exemplaire livre unique : pas de notion de stock par exemplaire.
- ❌ Pas d’interface Web complète : seule la console est fonctionnelle.
- ❌ La persistence est encore locale (SQLite), pas de support pour un vrai serveur ou base distante.
- ❌ Pas encore de tests automatisés pour toutes les couches (DAO, Service, Interface).
- ❌ Les fonctionnalités restent simples, pas de notifications, historique des emprunts, ou rapports avancés.