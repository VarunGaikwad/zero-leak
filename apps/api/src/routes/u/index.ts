import { Router, Request, Response, IRouter } from "express";
import jwt from "jsonwebtoken";
const router: IRouter = Router();

router.post("/login", (req: Request, res: Response) => {
  const { password } = req.body;

  if (password !== process.env.APP_PASSWORD) {
    res.status(401).json({ error: "Wrong password" });
    return;
  }

  const cookieSecret = process.env.COOKIE_SECRET;

  if (!cookieSecret) {
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  const token = jwt.sign(
    JSON.stringify({
      name: "Varun Gaikwad",
      email: "c6b4o@example.com",
    }),
    cookieSecret,
  );
  res.cookie("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60 * 1000,
  });

  res.json({ ok: true });
});

export default router;
