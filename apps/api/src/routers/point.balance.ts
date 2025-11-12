import { PointBalanceController } from '../controllers/poin.balance';
import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';

export class PointBalanceRouter {
  private router: Router;
  private pointBalanceController: PointBalanceController;

  constructor() {
    this.router = Router();
    this.pointBalanceController = new PointBalanceController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Routes tanpa :userId, langsung pakai user dari token
    this.router.post('/balance', verifyToken, this.pointBalanceController.updateBalance);
    this.router.get('/balance', verifyToken, this.pointBalanceController.getBalance);
  }

  public getRouter(): Router {
    return this.router;
  }
}
