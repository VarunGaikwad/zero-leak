import { Router, Request, Response, IRouter } from "express";

const router: IRouter = Router();

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("auth");
  res.json({ ok: true });
});

router.post("/me", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

export default router;
