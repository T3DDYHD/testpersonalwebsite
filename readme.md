# README

## T3DDYUHD Personlig Hjemmeside V1 

### Beskrivelse
Dette projekt er en dynamisk webapplikation, der fungerer som en brugerprofil. Den inkluderer:
- En baggrundsvideo for visuelt engagement.
- En live viewer-tæller for realtidsstatistik.
- Integration af Discord-statusopdateringer.

### Forudsætninger
For at køre dette projekt skal følgende være installeret:

- **Node.js** (version 14 eller nyere)
- **npm** (Node Package Manager, som følger med Node.js)
- En internetforbindelse til at hente nødvendige ressourcer

**Bemærk:** Applikationen kører som standard over en IP-adresse. Hvis du ønsker at køre den via et domænenavn, kan du konfigurere det med værktøjer som [shorturl.at/cCrpA](https://shorturl.at/cCrpA).

### Installation

Følg disse trin for at installere og starte projektet:

1. **Klon repositoryet eller download filerne:**
   ```bash
   git clone <repo-url>
   ```

2. **Installer de nødvendige pakker:**
   Kør følgende kommandoer i projektmappen:
   ```bash
   npm install express
   npm install axios
   npm install --save-dev nodemon
   npm install dotenv
   npm install cors
   ```

### Kørsel af projektet

1. Opret en `.env`-fil i projektets rodmappe og tilføj de nødvendige miljøvariabler (eksempelvis API-nøgler eller konfigurationsindstillinger).
2. Start serveren ved hjælp af Nodemon:
   ```bash
   npx nodemon app.js
   ```
3. Åbn din browser og naviger til den angivne IP-adresse eller domæne for at se applikationen i aktion.

### Yderligere information
Hvis du oplever problemer eller har spørgsmål, er du velkommen til at oprette en [issue](https://github.com/<repo-url>/issues) i repositoryet.

**God fornøjelse!**
