const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlerbars = require('handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const dotenv = require('dotenv');
const homeRouters = require('./routes/homeRoutes');
const postersRouter = require('./routes/posterRouter');
const authRouter = require('./routes/authRoutes')
const profileRouter = require('./routes/profileRoutes')
const helpers = require('./utils/hbsHelper');
const connectDB = require('./config/db');


//Env varibile
dotenv.config()

//Conecting to datebse
connectDB();


const app = express();

//Initizalite session store
const store = new MongoStore({
    collection: 'sessions',
    uri: process.env.MONGO_URL
})

//Body parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Register hendlebars helpers
helpers(Handlerbars)

//Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))


app.use(flash());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Initilazi templite engine (Handlerbars)
app.engine('.hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');


//Initilize routers
app.use('/', homeRouters);
app.use('/posters', postersRouter);
app.use('/auth', authRouter)
app.use('/profile', profileRouter)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`);
})