// 型情報だけをTypeScriptに教えるためのファイル

import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    requestId?: string;
  }
}