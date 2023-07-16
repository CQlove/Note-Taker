const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const api = express.Router();
api.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes, please check the routes or there is no saved note' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

api.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    const inputNote = {
        id: uuidv4(),
        title: title,
        text: text,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
    };

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(data);

        notes.push(inputNote);

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save note' });
            }

            res.json(inputNote);
        });
    });
});

module.exports = api;