# Projet We-transfer

## Groupe
Le groupe est composé de :
- Alexandre Vidal
- Mohamed Salamatao
- Lucas Rimbault

## Configuration
Créez un fichier `.env` dans le dossier server similaire au .env.example

## Lancer le projet
Pour lancer le projet, exécutez la commande suivante :
- docker compose up --build 
- Un fichier init.sql permet de créer une base de données d'initialisation avec les tables nécessaires.

## Utilisation
1. Créez un utilisateur, il sera ajouté dans la base de données.
2. Vous pouvez ensuite vous authentifier.
3. Une fois authentifié, vous pouvez uploader un fichier de votre choix.
4. Vous pouvez retrouver vos fichiers et changer les metadatas
5. Vous pouvez copier le lien de téléchargement du fichier une fois celui ci upload
6. Ajout d'une table mail_history pour gérer les mails envoyés dans le futur

## Fonctionnalités
### Fonctionnelles
- Enregistrement et authentification (register, login)
- Routes protégés client/server
- Upload local (fichier max par transfert : 2 Go)
- Lien de partage de fichiers
- Gestion des fichiers et des métadonnées

### Perspectives d'avenir
- Mise en place d'envoie de mail avec nodemailer et mailtrap
- Fonctionnalité premium avec une plus grande capacité d'envoi

