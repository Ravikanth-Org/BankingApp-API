const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors')

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json())
/*
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', index);
*/
// Configuring the database
const dbConfig = require('./config/dbconfig.js');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);



mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./app/routes/account.routes.js')(app);
require('./app/routes/users.routes.js')(app);
require('./app/routes/transaction.routes.js')(app);
require('./app/routes/admin.routes.js')(app);
require('./app/routes/branch.routes.js')(app);

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome."});
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});