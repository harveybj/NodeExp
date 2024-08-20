//handle 500 errors
// const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode ? res.statusCode : 500;
//     res.status(statusCode);
//     res.json({
//         message: err.message,
//         stack: process.env.NODE_ENV === "production" ? null : err.stack
//     })
// }

const { logEvents } = require("./logEvents");
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.txt"
  );
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
