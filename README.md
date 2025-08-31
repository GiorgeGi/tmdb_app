# TMDB APP

Η εφαρμογή **TMDB APP** αποτελεί έναν προσωπικό διαχειριστή ταινιών και σειρών, επιτρέποντας παρακολούθηση, σημειώσεις, αγαπημένα και προσαρμοσμένες καταχωρήσεις. Υλοποιείται με **React** για το frontend και **PHP + MySQL** για το backend.

## Περιγραφή

Η εφαρμογή υποστηρίζει:
* Προβολή και αναζήτηση ταινιών & σειρών μέσω TMDB API
* Δημιουργία προσαρμοσμένων καταχωρήσεων (custom movies/TV shows)
* Διαχείριση λιστών: Watchlist, Watched, Favorites
* Σημειώσεις ανά ταινία ή σειρά
* Toggle για αγαπημένα
* Authentication με session cookies και Bearer tokens
* REST API για όλες τις λειτουργίες

## Ξεκίνημα

### Εξαρτήσεις

* PHP 8+
* MySQL / MariaDB
* Composer (προαιρετικά για μελλοντικές βιβλιοθήκες)
* Node.js + npm (για το React frontend)
* Προγράμματα περιήγησης με υποστήριξη ES6

### Δομή Αρχείων

.
├── api
│   ├── add_custom_item.php
│   ├── _auth.php
│   ├── _config.php
│   ├── custom_fetch.php
│   ├── lists_fetch.php
│   ├── lists_get.php
│   ├── lists_remove.php
│   ├── lists_set.php
│   ├── login.php
│   ├── logout.php
│   ├── signup.php
│   └── update_list.php
├── directory_tree.txt
├── node_modules
│   └── ...
├── package.json
├── package-lock.json
├── public
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── TMDB.png
├── README.md
├── requirements.txt
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── components
│   │   ├── CustomDetail.js
│   │   ├── ListsHelper.js
│   │   ├── ListsPage.js
│   │   ├── Login.js
│   │   ├── MovieChatbot.css
│   │   ├── MovieChatbot.js
│   │   ├── MovieDetail.js
│   │   ├── MoviesList.js
│   │   ├── PopularTVShows.js
│   │   ├── Signup.js
│   │   ├── TrailersCarousel.js
│   │   ├── TvDetail.js
│   │   └── UserBubble.js
│   ├── context
│   │   ├── AuthContext.js
│   │   └── SearchContext.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── spaNavigation.js
│   └── style.css
└── tmdb_app.sql

### Εκτέλεση Backend

1. Δημιουργία βάσης και πινάκων από `db/schema.sql`.
2. Ανάθεση δικαιωμάτων στο χρήστη της βάσης.
3. Τοποθέτηση της εφαρμογής PHP σε web server (π.χ. Apache, Nginx) με ενεργοποιημένο PHP session.

### Εκτέλεση Frontend

```bash
Εγκατάσταση εξαρτήσεων
npm install 

Εκτέλεση σε development mode
npm start
Ανοίξτε http://localhost:3000

Build για Production
npm run build
```

## Σημειώσεις

1. Τα endpoints υποστηρίζουν τόσο cookie-based sessions όσο και Bearer token authentication.
2. Όλα τα JSON API endpoints επιστρέφουν Content-Type: application/json.
3. Προβλέπεται χειρισμός σφαλμάτων για authentication, validation και database exceptions.

## Συντάκτες

Βαρβαρίγος Γεώργιος (ece21090@uop.gr)
Πεγιάζης Γεώργιος (ece21081@uop.gr)

## Άδεια

This project is licensed under the GNU General Public License v3.0 License - see the LICENSE file for details

## Αναγνωρίσεις

* [A simple README.md template](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)
* [How to Install ReactJS on Linux] (https://www.geeksforgeeks.org/techtips/how-to-install-reactjs-on-linux/)
