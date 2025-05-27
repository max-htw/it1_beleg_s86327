# Lernportfolio zum Internettechnologie-Beleg

## Entwicklungsschritte

#### 11.05.2025
- Aufgabenstellung detailliert durchgehen
- GitHub Repository anlegen
- Lernportfolio anlegen
- Ordnerstruktur einfügen
- Grundgerüst in HTML erstellt, CSS angelegt und erste JS-Funktionalität eingefügt (mit Hilfe von ChatGPT)
- Aufgabenstellung zusammengefasst

#### 12.05.2025
- JavaScript in Model, View und Presenter aufgeteilt (mit Hilfe von ChatGPT)
- Fragen werden nun in zufälliger Reihenfolge angezeigt
- Reset-Button auch in Fragen-Ansicht angezeigt
- Shuffle-Funktion in utils ausgelagert

#### 16.05.2025
- KaTeX integriert über CDN und in View + Main eingepflegt

#### 21.05.2025
- Beginn der Integration der WebQuiz-API

#### 22.05.2025
- WebQuiz-API-Integration abgeschlossen (bisher nur eine Frage)
- Beginn der Vexflow-Integration zum Noten rendern

#### 23.05.2025 
- Vexflow-Integration debuggen + fertigstellen (mit Hilfe von ChatGPT)
- Bei externen Fragen wird nun eine zufällige in einem Bereich gewählt
- Beginn bestimmte Anzahl an externen Fragen (z.B. 5 Stk.) anzuzeigen -> derzeit mit Bug

#### 24.05.2025
- Es werden nun 5 externe Fragen in zufälliger Reihenfolge und Auswahl angezeigt
- Ladeanzeige inkl. Animation beim Laden der externen Fragen hinzugefügt
- GUI verschönert (mit Hilfe von ChatGPT)

#### 26.05.2025
- Offline-Funktionalität implementiert (manifest + sw) und getestet
- Favicons hinzugefügt
- Fehlermeldung beim Laden externer Fragen im Offline-Modus

#### 27.05.2025
- Versuch Piano-Keyboard und Audio-Funktion einzubauen
- erfolgreicher Test der Installation auf dem Smartphone
- Audio-Funktion einzeln über Button integriert

## Lernfortschritt

#### 11.05.2025
- Beschäftigen mit Model-View-Presenter-Architektur

#### 12.05.2025
- Erlernen von Modulen (inkl. Imports) und deren Anwendung in JavaScript

#### 16.05.2025
- Beschäftigen mit WebQuiz API

#### 21.05.2025
- Per CURL in WebQuiz API auf idefix registriert und einige Fragen selbst erstellt

#### 22.05.2025
- Um externe Fragen abzurufen, muss ich mich ins HTW-Netz verbinden, da sonst der Port 8888 blockiert wird
- Beschäftigen mit Vexflow

#### 23.05.2025
- Vexflow funktioniert in meinem Anwendungsfall nur, wenn der strikte Modus deaktiviert ist

#### 24.05.2025
- Auffrischen vom Grid-Kenntnissen

#### 26.05.2025
- PWA-Funktionalität und Implementierungsweise
- Beschäftigen mit Piano-Keyboard und Notensound-Bibliotheken

#### 27.05.2025
- einige Probleme lassen sich durch Clearen des ServiceWorker-Caches lösen


## Misserfolge
- Einbauen des Piano-Keyboards und der Audioausgabe:
  - Versuch mit Qwerty Hancock, aber Fehler, da Key nicht wieder "losgelassen" wurde und somit dann endlos gedrückt gehalten wurde
  - weitere kleine Versuche mit eigener Darstellung, aber zu aufwendig
  - am Ende dennoch zumindest die Audiofunktion implementiert

