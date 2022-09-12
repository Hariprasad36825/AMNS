import app from "./app";
import { connectDB } from "./config/db_config";

// Constants
const PORT = 8080;
const HOST = "127.0.0.1";

// App
connectDB().then(() => {
  app.listen(PORT, HOST);
});
