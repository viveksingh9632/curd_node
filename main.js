require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.set("view engine", "ejs");

var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories.js');
var users = require('./routes/users.js');
const staticRoute = require("./routes/staticRouter");



app.use('/', pages);           // This should work if `pages` is a router instance
app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
 app.use('/users', users);
app.use("/users",  staticRoute);



// This should work if `adminPages` is a router instance
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
