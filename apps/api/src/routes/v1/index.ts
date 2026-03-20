import { Router, Request, Response, IRouter } from "express";

import * as store from "../../data/mock.js";
import { v4 as uuidv4 } from "uuid";

const router: IRouter = Router();

// Helper to generate CRUD routes for store resources
function createCrud(path: string, storeArr: any[]) {
  // GET all
  router.get(`/${path}`, (req: Request, res: Response) => {
    res.json(storeArr);
  });

  // GET one
  router.get(`/${path}/:id`, (req: Request, res: Response) => {
    const item = storeArr.find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  // POST create
  router.post(`/${path}`, (req: Request, res: Response) => {
    const newItem = {
      ...req.body,
      id: uuidv4(),
    };
    storeArr.push(newItem);
    res.status(201).json(newItem);
  });

  // PUT update
  router.put(`/${path}/:id`, (req: Request, res: Response) => {
    const index = storeArr.findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    const updated = { ...storeArr[index], ...req.body, id: req.params.id };
    storeArr[index] = updated;
    res.json(updated);
  });

  // DELETE
  router.delete(`/${path}/:id`, (req: Request, res: Response) => {
    const index = storeArr.findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    storeArr.splice(index, 1);
    res.json({ ok: true });
  });
}

// Generate all routes
createCrud("categories", store.categories);
createCrud("accounts", store.accounts);
createCrud("transactions", store.transactions);
createCrud("subscriptions", store.subscriptions);

// Overwrite GET budgets to dynamically calculate spent
createCrud("budgets", store.budgets); // Register default routes first
router.get("/budgets", (req: Request, res: Response) => {
  const updatedBudgets = store.budgets.map((budget: any) => {
    // Calculate total spent for this budget by checking all matching transactions (matching by title)
    const budgetCategoryTitles = budget.category?.map((c: any) => c.title) || [];
    
    const spent = store.transactions
      .filter((tx: any) => 
        tx.category?.some((txCat: any) => budgetCategoryTitles.includes(txCat.title))
      )
      .reduce((sum: number, tx: any) => {
        // Only sum if it's an expense (amount < 0)
        return tx.amount < 0 ? sum + Math.abs(tx.amount) : sum;
      }, 0);

    return { ...budget, spent };
  });
  res.json(updatedBudgets);
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("auth");
  res.json({ ok: true });
});

router.get("/me", (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ ok: true, user });
});

export default router;
