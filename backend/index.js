const express = require("express");

const mainRouter = require("./routes/index");

const app = express();

app.use("/api/v1",mainRouter);



// /api/v1/user/sign-up
// /api/v1/user/signin
// /api/1v/user/changePassword....

// route user requests to user router and account requests to account router


// /api/v1/account/transferMoney
// /api/v1/account/balance

//


