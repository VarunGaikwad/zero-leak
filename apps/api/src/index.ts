import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:2312",
  }),
);

app.get("/api/user", (req, res) => {
  const user = {
    id: "1",
    email: "test@example.com",
  };
  res.json(user);
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
