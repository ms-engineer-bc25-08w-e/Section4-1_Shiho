// ExpressにPrismaを組み込む為の処理（PrismaClientを作成）

import { PrismaClient } from "./generated/prisma";
export const prisma = new PrismaClient;