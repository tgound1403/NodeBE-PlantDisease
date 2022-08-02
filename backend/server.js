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
const session = require('express-session');
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



app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://desolate-everglades-44147.herokuapp.com"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
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

