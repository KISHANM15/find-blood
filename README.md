# Blood Donor Finder

A simple, responsive web app to **register blood donors** and **search by blood group**, using **HTML, CSS, JavaScript**, and **Firebase Firestore**.

## Your Firebase project (reference)

| Item | Value |
|------|--------|
| **Project name** | blood donar |
| **Project ID** | `blood-donar-e1975` |
| **Project number** | `887857474495` |

- **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com/) → open project **blood-donar-e1975**
- **Web app config** (`apiKey`, `appId`, etc.) lives in **`app.js`** as `firebaseConfig`. Update it there if you add a new web app or rotate keys.

> **Note:** The web API key in `app.js` is normal for Firebase web apps. Protect your data with **Firestore security rules**, not by hiding the key.

## Project files

| File | Purpose |
|------|--------|
| `index.html` | Home page + navigation |
| `register.html` | Donor registration form |
| `search.html` | Search donors by blood group |
| `style.css` | Layout, theme, responsive styles |
| `app.js` | Firebase init, Firestore read/write, validation |

## Setup

1. **Firestore**
   - In Firebase Console: **Build → Firestore Database** → create database if needed.
   - Default collection name used in code: **`donors`**.

2. **Security rules (important)**
   - Start in **test mode** only for local learning.
   - Before sharing publicly, use rules that limit who can read/write (or add **Authentication**). See [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started).

3. **Run the app**
   - This project uses **ES modules** (`import` in `app.js`). Open the site with a **local server**, not as `file://`:
     - **VS Code:** install **Live Server** → right-click `index.html` → *Open with Live Server*
     - **Terminal** (in this folder): `npx serve .` then open the URL shown in the browser

## Features

- Required field validation; **phone must be 10 digits**
- Blood group from dropdown only
- Success / error messages and Firebase error handling pattern
- Search: loading state, donor **cards**, **total count**, “No donors found”
- Optional **Firebase Analytics** in `app.js` (after `initializeApp`)

## Environment in Firebase

**Project settings → Environment** (*Unspecified* or dev/prod) is only for organizing the project in the console. It does not change how this app connects to Firestore.

---

Built for learning; tighten Firestore rules before production use.
