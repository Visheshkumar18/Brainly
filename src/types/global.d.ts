// global.d.ts or types/express/index.d.ts
import { IUser } from './models/userSchema'; // adjust path

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}
