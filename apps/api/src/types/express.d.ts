import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // you can replace 'any' with your JWT payload type
  }
}
