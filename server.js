const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

const crypto = require('crypto');

function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

const originalHash = getFileHash(path.join(__dirname, 'public', 'script.js'));

app.get('/check-integrity', (req, res) => {
    const currentHash = getFileHash(path.join(__dirname, 'public', 'script.js'));
    res.json({ valid: currentHash === originalHash });
});

const databaseFilePath = path.join(__dirname, 'database.json');

if (!fs.existsSync(databaseFilePath)) {
    fs.writeFileSync(
        databaseFilePath,
        JSON.stringify({ ips: [], offlineData: [] }, null, 2)
    );
}

let database = JSON.parse(fs.readFileSync(databaseFilePath, 'utf8'));

const saveDatabase = () => {
    fs.writeFileSync(databaseFilePath, JSON.stringify(database, null, 2));
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/get-viewer-count', (req, res) => {
    const viewCount = database.ips.length;
    res.json({ viewCount });
});

app.post('/update-viewer-count', (req, res) => {
    const ip = req.body.ip;

    if (!database.ips.includes(ip)) {
        database.ips.push(ip);
        saveDatabase();
    }

    res.status(200).json({ success: true, viewCount: database.ips.length, ips: database.ips });
});

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

        let offlineDuration = null;
        if (offlineEntry && offlineEntry.lastSeenOffline) {
            const offlineStart = new Date(offlineEntry.lastSeenOffline);
            const now = new Date();
            offlineDuration = Math.floor((now - offlineStart) / 1000);
        }

        res.json({
            ...discordData,
            lastSeenOffline: offlineEntry ? offlineEntry.lastSeenOffline : null,
            offlineDuration
        });
    } catch (error) {
        console.error('Error fetching Discord profile:', error);
        res.status(500).send('Error fetching Discord profile');
    }
});

app.get('/get-spotify-status', async (req, res) => {
    try {
        const discordId = '513639579715371009';
        const response = await axios.get(`https://api.lanyard.rest/v1/users/${discordId}`);
        const spotifyData = response.data.data.spotify;

        if (spotifyData) {
            res.json({
                is_playing: true,
                song_title: spotifyData.song,  // Ændret fra song_name
                artist: spotifyData.artist,    // Ændret fra artist_name
                album_cover: spotifyData.album_art_url,
                elapsed_time: (Date.now() - spotifyData.timestamps.start) / 1000,
                duration: (spotifyData.timestamps.end - spotifyData.timestamps.start) / 1000
            });
        } else {
            res.json({ is_playing: false });
        }
    } catch (error) {
        console.error('Error fetching Spotify status:', error);
        res.status(500).send('Error fetching Spotify status');
    }
});

app.get('/get-ad', (req, res) => {
    const adData = {
        image: "https://media.discordapp.net/attachments/1313891268257910855/1336393037798051993/logo.png?ex=67a6f041&is=67a59ec1&hm=2087dffb60be55a6bfb489e917d7a1e7a1744a0ae9a84368f0076b482bfeacd4&=&format=webp&quality=lossless&width=790&height=670",
        title: "T&T Scripts",
        description: "T&T Scripts bedste kvalitets scripts for pengene",
        invitecode: "https://discord.gg/RtJtrYEZcE"
    };
    res.json(adData);
});

app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});
