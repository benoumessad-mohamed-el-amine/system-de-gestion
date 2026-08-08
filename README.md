# Système de Gestion de Stock & Point de Vente (POS)

Système complet de gestion de stock, d'inventaire et de point de vente (POS) en temps réel construit avec **Next.js 16 (App Router)**, **TypeScript**, **MongoDB / Mongoose**, **Tailwind CSS 4**, **NextAuth v5**, **Zustand**, et **Socket.IO**.

---

## 🚀 Fonctionnalités Principales

- 🛒 **Point de Vente (POS)** : Recherche ultra-rapide, scanner de code-barres en temps réel, gestion de panier, mise en attente de caisses, impression de tickets thermiques (80mm).
- 📦 **Gestion de Stock & Produits** : Inventaire multi-dépôts/branches, ajustements de stock avec journaux d'audit, gestion des catégories et des marques.
- ⚡ **Temps Réel (Socket.IO)** : Synchronisation instantanée des ventes et du stock sur toutes les caisses et terminaux actifs.
- 👥 **Clients & Fournisseurs** : Suivi des ventes par client, historique d'achats auprès des fournisseurs.
- 📊 **Tableau de Bord & Rapports** : Statistiques de chiffre d'affaires, graphiques interactifs (Recharts), alerte de stock bas, exportations PDF / Excel / CSV.
- 🔒 **Sécurité & Authentification** : Authentification NextAuth v5 avec rôles (Administrateur / Caissier) et permissions.
- 📄 **Impression Thermique** : Génération et impression automatique des reçus de caisse après chaque transaction.

---

## 🛠️ Stack Technique

- **Frontend & App Framework** : Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI** : Tailwind CSS 4, Radix UI Primitives, Lucide Icons, Sonner (Toast Notifications)
- **Base de Données** : MongoDB, Mongoose ORM
- **Gestion d'État** : Zustand
- **Temps Réel** : Socket.IO (Serveur Node.js indépendant)
- **Rapports & PDF** : jsPDF, AutoTable, XLSX

---

## 📁 Structure du Projet

```
pos_system/
├── src/
│   ├── app/                    # Pages App Router & Routes d'API
│   │   ├── (auth)/             # Connexion & récupération
│   │   ├── (dashboard)/        # Tableau de bord & POS
│   │   └── api/                # Endpoints REST API
│   ├── components/             # Composants UI, POS, Modales
│   ├── hooks/                  # Hooks React personnalisés (Socket, Keyboard)
│   ├── lib/                    # Connexion DB, Utils, Impression
│   ├── models/                 # Schémas Mongoose (Product, Sale, User...)
│   ├── repositories/           # Couche d'accès aux données (DAL)
│   ├── services/               # Logique métier
│   └── stores/                 # Zustand (Panier & Caisses)
├── scripts/                    # Scripts d'initialisation (Seed database)
└── server/                     # Serveur Socket.IO temps réel
```

---

## 💻 Démarrage Rapide

### 1. Prérequis

- **Node.js** v18+
- **MongoDB** (Local ou [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Installation & Configuration

```bash
# Cloner le projet
git clone https://github.com/benoumessad-mohamed-el-amine/system-de-gestion.git
cd system-de-gestion

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
```

Éditez le fichier `.env.local` :

```env
MONGODB_URI=mongodb://127.0.0.1:27017/pos_system
AUTH_SECRET=votre-cle-secrete-32-caracteres
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
```

Générer une clé `AUTH_SECRET` aléatoire :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Initialiser la Base de Données (Seed)

```bash
npm run seed
```

Comptes par défaut créés :
| Rôle | Email | Mot de passe |
|---|---|---|
| **Administrateur** | `admin@pos.local` | `Admin@123456` |
| **Caissier** | `cashier@pos.local` | `Cashier@123` |

### 4. Lancer le Serveur de Développement

```bash
npm run dev
```
Accédez à `http://localhost:3000` sur votre navigateur.

### 5. Lancer le Serveur Socket.IO (Temps Réel)

Dans un second terminal :
```bash
npm run socket
```

---

## 🏷️ Scanner de Code-Barres

Le système prend en charge l'ensemble des lectrices / scanners de code-barres USB et Sans Fil (2.4G / Bluetooth) fonctionnant en **Émulation Clavier HID**.
- Placez le curseur dans le champ de recherche de la caisse (auto-focus par défaut) et scannez l'article. Le produit s'ajoute automatiquement au panier.

---

## 📜 Licence

Projet sous licence MIT.
