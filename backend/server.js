// Import from other files or modules
const morgan = require("morgan");
// MongoDB
const connectDB = require("./config/db");
const routes = require("./routes/api");
var passport = require("passport");
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const { notFound } = require("./middlewares/errorMiddleware");
const { errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");
// const initRoutes = require('./routes/web');
const flash = require('express-flash');
const session = require('cookie-session');
const app = express();
const bodyParser = require('body-parser');
// const render = require('express-react-view')
const path = require('path');

// const options = {
//     root: path.join('./', 'views'),
//     ext: 'jsx',
//     cache: false,
//     layout: 'reset',
// }
// app.set('views', './' + '/views')
// app.set('view engine', 'jsx')
// app.engine('jsx', render(options))

// const createEngine = require('express-react-views');
app.set('views', './views');
app.set('view engine', 'jsx');
// app.engine('jsx', createEngine.createEngine());
// app.set('view engine', 'ejs')

// console.log(process.env.AUTH_PASS)
dotenv.config();
connectDB();

app.use(session({
    secret: 'secret option',
    resave: true,
    saveUninitialized: true
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

const corsOptions = {
    origin: ["http://localhost:3000/", "https://whale-app-39ifh.ondigitalocean.app/"],
    preflightContinue: false,
    credentials: true
}

app.all('*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //...
});

app.use(cors(corsOptions));

// app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(flash())
// app.set('view engine', 'jsx');
// app.set('view engine', 'js');

// Data parsing
app.use(express.json());

app.use('/api/users', userRoutes);
// Error Handling middlewares
// app.use(notFound);
// app.use(errorHandler);
app.use(express.urlencoded({ extended: true }))
// initRoutes(app)

// const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`.yellow)
});

