# Master's Portal - Frontend

Master's Portal est une application web et mobile conçue pour gérer les écoles de Kung Fu au Maroc. Cette partie frontend offre une interface utilisateur intuitive permettant aux Maîtres, instructeurs et élèves d'accéder facilement aux fonctionnalités de gestion.

## 🚀 Fonctionnalités principales

- Affichage des écoles de Kung Fu sur une carte interactive
- Recherche des écoles proches de l'utilisateur
- Gestion des profils des élèves et instructeurs
- Suivi des certifications sportives et passeports sportifs
- Inscription et participation aux événements
- Paiements sécurisés via Stripe
- Notifications en temps réel

## 🛠️ Technologies utilisées

- **Framework** : React
- **State Management** : Redux Toolkit
- **Routing** : React Router
- **API Calls** : Axios
- **UI Library** : Tailwind CSS
- **Paiements** : Stripe

## 📦 Prérequis

- Node.js et npm installés
- Compte Stripe pour les paiements
- Backend opérationnel

## ⚙️ Installation

1. **Cloner le dépôt** :
    ```bash
    git clone https://github.com/e-lglioui/Giao-Long-front.git
    cd frontend
    ```
2. **Installer les dépendances** :
    ```bash
    npm install
    ```
3. **Configurer les variables d'environnement** :
    Créez un fichier `.env` à la racine et ajoutez :
    ```env
    REACT_APP_API_URL=http://localhost:3000/
    REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
    MAPS_API_KEY=your_google_maps_api_key
    ```
4. **Lancer l'application** :
    ```bash
    npm start
    ```

## 📧 Configuration de Stripe

- Assurez-vous d'avoir un compte Stripe.
- Récupérez votre clé publique Stripe et configurez-la dans le fichier `.env`.

## 🚀 Déploiement

Pour construire l'application pour la production :
```bash
npm run build
```
Le dossier `build/` peut être déployé sur n'importe quel service d'hébergement.

## 📝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question, contactez-nous à : elgliouif@gmail.com


