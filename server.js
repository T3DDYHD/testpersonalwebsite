const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

const databaseFilePath = path.join(__dirname, 'database.json');

// Initialiser database, hvis filen ikke eksisterer
if (!fs.existsSync(databaseFilePath)) {
    fs.writeFileSync(
        databaseFilePath,
        JSON.stringify({ ips: [], offlineData: [] }, null, 2)
    );
}

let database = JSON.parse(fs.readFileSync(databaseFilePath, 'utf8'));

// Helper-funktion til at gemme database
const saveDatabase = () => {
    fs.writeFileSync(databaseFilePath, JSON.stringify(database, null, 2));
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint til at hente viewCount
app.get('/get-viewer-count', (req, res) => {
    const viewCount = database.ips.length; // Antal unikke IP'er
    res.json({ viewCount });
});

// Endpoint til at opdatere IP'er
app.post('/update-viewer-count', (req, res) => {
    const ip = req.body.ip;

    // Hvis IP'en ikke findes i databasen, tilføj den
    if (!database.ips.includes(ip)) {
        database.ips.push(ip);
        saveDatabase();
    }

    res.status(200).json({ success: true, viewCount: database.ips.length, ips: database.ips });
});

// Endpoint til at hente Discord-profil og gemme offline-tid
app.get('/get-discord-profile', async (req, res) => {
    try {
        const discordId = '513639579715371009';
        const response = await axios.get(`https://api.lanyard.rest/v1/users/${discordId}`);
        const discordData = response.data.data;

        const offlineEntry = database.offlineData.find(
            (entry) => entry.discordId === discordId
        );

        if (discordData.discord_status === 'offline') {
            if (!offlineEntry) {
                database.offlineData.push({
                    discordId,
                    lastSeenOffline: new Date().toISOString()
                });
                saveDatabase();
            }
        } else {
            if (offlineEntry) {
                database.offlineData = database.offlineData.filter(
                    (entry) => entry.discordId !== discordId
                );
                saveDatabase();
            }
        }

        // Beregn offline-tiden
        let offlineDuration = null;
        if (offlineEntry && offlineEntry.lastSeenOffline) {
            const offlineStart = new Date(offlineEntry.lastSeenOffline);
            const now = new Date();
            offlineDuration = Math.floor((now - offlineStart) / 1000); // Tid i sekunder
        }

        res.json({
            ...discordData,
            lastSeenOffline: offlineEntry ? offlineEntry.lastSeenOffline : null,
            offlineDuration
        });
    } catch (error) {
        console.error('Fejl ved hentning af Discord-profil:', error);
        res.status(500).send('Fejl ved hentning af Discord-profil');
    }
});

app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});
