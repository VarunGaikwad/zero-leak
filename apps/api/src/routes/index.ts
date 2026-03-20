import { Router, IRouter, NextFunction, Response, Request } from "express";
import unauth from "./u/index.js";
import version1 from "./v1/index.js";
import jwt from "jsonwebtoken";

const router: IRouter = Router();

router.use("/u", unauth);
router.use("/v1", middleware_auth, version1);

function middleware_auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.COOKIE_SECRET!);
    (req as any).user = decoded; // optional
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default router;
