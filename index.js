const express = require("express");
const mongoose = require("mongoose");
// const compression = require('compression')
const cookieParser = require('cookie-parser')
const cors = require("cors")
// const {logRequest} = require("./helpers/reqLogger")
require("dotenv").config();

// const cards = require("./routes/api/cards");
// const population = require("./routes/api/population");
// const sales = require("./routes/api/sales");
// const revenue = require("./routes/api/revenue");
// const market = require("./routes/api/market");
// const msv = require("./routes/api/msv");
// const radar = require("./routes/api/radar");
// const ranks = require("./routes/api/ranks");
const userRoute = require("./routes/api/user.route");
const countryRoute = require("./routes/api/country.route");
const currencyRoute = require("./routes/api/currency.route");
const paymentTermRoute = require("./routes/api/paymentterm.route");
const bankAccountRoute = require("./routes/api/bankAccount.route");
const customerRoute = require("./routes/api/customer.route");
// const auctionMonitor = require("./routes/api/auctionMonitor.route");
// const underValueRoute = require("./routes/api/underValue.route")
// const mtglRoute = require('./routes/api/mtgl.route')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser({sameSite: 'none'}))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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

// app.use(compression({
//   level: 6,
//   threshold: 0
// }))


mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${Date().toString()}`)
  next()
})

// app.use(logRequest)

// app.use("/api/cards", cards);
// app.use("/api/sales", sales);
// app.use("/api/population", population);
// app.use("/api/revenue", revenue);
// app.use("/api/market", market);
// app.use("/api/msv", msv)
// app.use("/api/radar", radar)
// app.use("/api/ranks", ranks)
app.use("/api/user", userRoute)
app.use("/api/country", countryRoute)
app.use("/api/currency", currencyRoute)
app.use("/api/payment-term", paymentTermRoute)
app.use("/api/bank-account", bankAccountRoute)
app.use("/api/customer", customerRoute)
// app.use("/api/auctionMonitor", auctionMonitor)
// app.use("/api/underValue", underValueRoute)
// app.use("/api/mtgl", mtglRoute)

  app.get("/", (req, res) => {
    res.send("Server running");
  })

// GET API route to download CSV file
// app.get('/metrics', (req, res) => {
//   const file = `./metrics.csv`;
//   res.download(file);
// });

const port = process.env.PORT || 7000;

app.listen(port,  () => {
console.log('Server running on port ' + port)
})
