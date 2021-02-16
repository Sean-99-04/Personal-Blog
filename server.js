if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const router = require("./routes/routes.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");

const { PORT, MONGODB_URI, NODE_ENV, SESSION_SECRET } = process.env;

// MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// View Engine (Handlebars)
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const SECURED = NODE_ENV == "production";
app.use(
  session({
    secret: "random-secret",
    resave: false,
    saveUninitialized: true,
    name: "sid",
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
      secret: SESSION_SECRET,
    }),
    cookie: {
      secure: SECURED,
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(router);

// Server
app.listen(
  PORT || 5000,
  console.log("Server running at http://localhost:5000")
);
