const express = require('express');
// require routes
const html = require('./Develop/routes/html');
const api = require('./Develop/routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./Develop/public'));

app.use(api);
app.use(html);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});