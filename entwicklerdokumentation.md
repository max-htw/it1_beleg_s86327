# LernApp (PWA-WebApp)

Dieses Lernprogramm wurde im Rahmen eines Belegs im Modul *Webprogrammierung* entwickelt.  
Der Beleg dient der praktischen Anwendung der Kenntnisse zu HTML, CSS, Javascript sowie einer Server-API. Die Umsetzung als PWA ermöglicht auch die einfache und komfortable Nutzung in mobilen Geräten.

---

## Lernziele & Technologien

- Nutzung von **HTTP/HTTPS** und dem **Fetch-API**
- **HTML** zur Strukturierung, **CSS** für das Layout und **Responsiveness**
- **JavaScript (ES6 Module)** mit DOM-Interaktion
- Architektur nach dem **Model-View-Presenter (MVP)**-Prinzip
- Verwendung von **externen JS-Bibliotheken**:
  - `KaTeX` zur Anzeige mathematischer Formeln
  - `VexFlow` zur Notendarstellung
  - `Tone.js` zur Audioausgabe
- Offlinefähigkeit über **Service Worker**
- Integration eines **Web App Manifests** für PWA-Unterstützung
- Dynamisches Nachladen von Fragen via **AJAX** & **REST-API**
- Datenübertragung im **JSON-Format**

---

## Projektstruktur

```plaintext
.
├── index.html                # Einstiegspunkt
└── /style
    ├── styles.css            # Layout & responsive Design
├── manifest.json             # Web App Manifest (für PWA)
├── sw.js                     # Service Worker für Offlinefähigkeit
├── /data
│   └── questions.json        # Fragen für interne Kategorien
├── /icons                    # App Icons und Favicons
└── /js
    ├── main.js               # Presenter (steuert den Ablauf)
    ├── model.js              # Zustände & Logik
    ├── view.js               # Darstellung & Interaktion
    └── utils.js              # Hilfsfunktionen (z. B. shuffle)