# Blood Donor Finder

A simple, responsive web app to **register blood donors** and **search by blood group**, using **HTML, CSS, JavaScript**, and **Firebase Firestore**.

## Firebase configuration

- Add your own Firebase web app config in `app.js` under `firebaseConfig`.
- Get values from **Firebase Console → Project settings → General → Your apps**.
- Do not commit private project identifiers if you do not want them public.

> **Note:** Firebase web API keys are client-side by design. Data protection should be enforced with proper Firestore security rules.

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
