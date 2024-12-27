const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// Establish global connection
const db = require("./src/utils/mongodb");
db.connectDb();

const app = express();

// View engine setup
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

console.log(
  "dsfdfs",
  path.join(__dirname, "bikeApi-backend", "src", "uploduser")
);
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS setup
app.use(cors({ origin: "*", credentials: true }));
app.use(cors({ origin: "http://localhost:3000" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Pragma", "no-cache");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "greenLine EV  Bikes Api Documentation",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://192.168.1.6:8000",
      description: "development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API calls to main router
const routeApis = require("./src/routes/route");
// const doctorCategoryRoutes = require('./src/routes/doctorCategoryRoutes');
// const productCategoryRoutes = require('./src/routes/productCategoryRoutes');
// const product_filed = require('./src/routes/productRoutes')
// const user = require('./src/routes/user_d')
// const cart = require('./src/routes/cartRoutes')

app.use(routeApis);
// app.use(productCategoryRoutes);
// app.use(doctorCategoryRoutes);
// app.use(product_filed);
// app.use(user);
// app.use(cart);

// Root route of express app
app.get("/", (req, res) => {
  res.send("Welcome to Starmedicahub");
});

// Catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   res.send("Resource Not found in  greenLine EV  Bikes services");
// });

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
});

// Listen on port
const PORT = process.env.PORT || 7000;
app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
