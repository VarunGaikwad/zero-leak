import { Router, IRouter, NextFunction, Response, Request } from "express";
import unauth from "./u/index.js";
import version1 from "./v1/index.js";
const router: IRouter = Router();

router.use("/u", unauth);
router.use("/v1", middleware_auth, version1);

function middleware_auth(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.auth !== process.env.COOKIE_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export default router;
