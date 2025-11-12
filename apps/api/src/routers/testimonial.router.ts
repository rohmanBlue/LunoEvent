import { Router } from 'express';
import { TestimonialController } from '../controllers/testimonial.controller';
import { verifyToken } from '../middleware/verifyToken';

export class TestimonialRouter {
  private router: Router;
  private testimonialController: TestimonialController;

  constructor() {
    this.router = Router();
    this.testimonialController = new TestimonialController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Semua route pakai token verify
    this.router.post(
      '/testimonial/:eventId',
      verifyToken,
      this.testimonialController.createTestimonial,
    );

    this.router.get(
      '/testimonial/:eventId',
      verifyToken,
      this.testimonialController.readTestimonial,
    );

    this.router.put(
      '/testimonial/:id',
      verifyToken,
      this.testimonialController.updateTestimonial,
    );

    this.router.delete(
      '/testimonial/:id',
      verifyToken,
      this.testimonialController.deleteTestimonial,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
