const express = require('express');
const path = require('node:path')
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/routes.js');
var cors = require('cors')
require('dotenv').config();


const app = express();
require('./config/passport')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors({origin: '*'}))
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));