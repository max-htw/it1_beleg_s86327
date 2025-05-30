# Beleg WebProgrammierung PWA - Maximilian Lohr

## Erfüllte Aufgaben
- Note 4: Programm funktioniert lt. Anforderung mit internen Mathematikaufgaben ✅
- Note 3: zzgl. funktionsfähige Nutzung des externen Aufgabenservers ✅
- Note 2: zzgl. Kategorie Notenlernen ✅
- Note 1: zzgl. Piano-Keyboard ⚠️
  - Piano-Keyboard nicht implementiert (siehe  [Lernportfolio](lernportfolio.md), Misserfolge), aber Audiowiedergabe vorhanden

## Eventuelle Probleme
- Aufruf außerhalb des HTWD-Netzes, da dort die externen Aufgaben nicht geladen werden können
- Wenn auf Mobilgeräten der Stummmodus aktiviert ist, wird die Note nicht abgespielt

## Genutzer Browser
- Aktueller Chrome, ebenfalls mit Edge und Safari getestet
- VPN-Verbindung zur HTWD notwendig für externe Fragenkategorie

## Vorschläge zur Verbesserung/Erweiterung
- Piano-Keyboard implementieren
- UI/UX überarbeiten
- Fehlermeldung bei Zugriff außerhalb des HTWD-Netzes
- Rendern der Mathe-Lösungsmöglichkeiten ebenfalls mit KaTeX
- Weitere Fragen einbinden (extern o. über JSON-Datei)
- Anzeige und Korrektur der falschen Antworten in Auswertung

## Nutzungs-Dokumentation
- Zum Starten der PWA muss ein lokaler Server eingerichtet werden
- Zum Testen kann entweder eine VS-Code-Extension wie Live Server oder ein HTTP-Server über Python oder Node.js genutzt werden
- Alternativ könnte die PWA über GitHub-Pages hochgeladen und dann global genutzt werden

## Weitere Dokumentationen
- [Entwicklerdokumentation](entwicklerdokumentation.md)
- [Lernportfolio](lernportfolio.md)
- [Aufgabenstellung (zusammengefasst)](aufgabenstellung_zsmgefasst.md)