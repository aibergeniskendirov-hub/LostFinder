import app from "./app.js";
import { PORT } from "./config/index.js";

app.listen(PORT, () => {
  console.log(`LostFinder server listening on http://localhost:${PORT}`);
});
