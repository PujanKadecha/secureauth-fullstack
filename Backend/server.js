const app = require("./app");
const connectDB = require("./config/db");
require("./config/redis");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running and listening on IPv4 at http://localhost:${PORT}`,
    );
  });
});