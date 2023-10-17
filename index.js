const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const cors = require("cors")
require("dotenv").config();

const userRoute = require("./routes/api/user.route");
const countryRoute = require("./routes/api/country.route");
const currencyRoute = require("./routes/api/currency.route");
const paymentTermRoute = require("./routes/api/paymentterm.route");
const bankAccountRoute = require("./routes/api/bankAccount.route");
const customerRoute = require("./routes/api/customer.route");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser({ sameSite: 'none' }))

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding"
  );
  next();
});

mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${Date().toString()}`)
  next()
})

app.use("/api/user", userRoute)
app.use("/api/country", countryRoute)
app.use("/api/currency", currencyRoute)
app.use("/api/payment-term", paymentTermRoute)
app.use("/api/bank-account", bankAccountRoute)
app.use("/api/customer", customerRoute)

app.get("/", (req, res) => {
  res.send("Server running");
})

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log('Server running on port ' + port)
})
