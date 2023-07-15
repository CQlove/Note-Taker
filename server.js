const fs = require('fs');
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// setting application of express; port
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./Develop/public'));

// added get routes to read bd.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes, please check the routes or there is no saved note' });
        }

        const notes = JSON.parse(data);
        res.json(notes);
    });
});

// added post routes to read and write bd.json
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    // setting obj to save
    const inputNote = {
        id: uuidv4(),
        title: title,
        text: text,
        // toLocaleTime transfer a readable time to me
        date: new Date().toLocaleTimeString(),
    };
    // read db.json
    fs.readFile(path.join(__dirname, './Develop/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to read notes' });
        }

        const notes = JSON.parse(data);

        notes.push(inputNote);
        // write into db.json
        fs.writeFile(path.join(__dirname, './Develop/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save note' });
            }

            res.json(inputNote);
        });
    });
});

// added path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});