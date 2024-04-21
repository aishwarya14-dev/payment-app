const express = require("express");

const mainRouter = require("./routes/index");

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); //body-parser that helps parse json objects

app.use("/api/v1",mainRouter);

app.listen(3000);



// /api/v1/user/sign-up
// /api/v1/user/signin
// /api/1v/user/changePassword....

// route user requests to user router and account requests to account router


// /api/v1/account/transferMoney
// /api/v1/account/balance

//


