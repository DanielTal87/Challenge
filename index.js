'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const {PORT = 8888} = process.env; // use default port 8888 or use the Port that was set
const currentVersion = 'v1';

app.use(express.json());

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({extend: "false"}));

// Sets public folder as the express static folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// App Routes by version
app.use('/v1', require('./routes/v1'));

// Set the Home page to the current version - more flexible to change version
app.use('/', (request, response) => response.redirect(`http://localhost:${PORT}/${currentVersion}`));

app.listen(PORT, () => console.log(`Listening on port ${PORT} in 'Reblaze' app`));
