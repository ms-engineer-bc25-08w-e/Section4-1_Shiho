// transactions用のAPIルーターをまとめて定義

import { Router } from "express";
import { transactionController } from "../controllers/transactionController";

const router = Router();

// GET /transactions
router.get("/", transactionController.getAll);

// GET /transactions/:id
router.get("/:id", transactionController.getById);

// POST /transactions
router.post("/", transactionController.create);

// PUT /transactions/:id（更新）
router.put("/:id", transactionController.update);

// DELETE /transactions/:id（削除）
router.delete("/:id", transactionController.delete);

export default router;
