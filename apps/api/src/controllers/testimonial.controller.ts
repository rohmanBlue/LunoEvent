import { Request, Response } from 'express';
import prisma from '../prisma';

export class TestimonialController {
  async createTestimonial(req: Request, res: Response) {
    const { userId, eventId, reviewDescription, rating } = req.body;
  
    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });
  
      if (!event) {
        return res.status(404).send({ message: 'Event not found.' });
      }
  
      const currentTime = new Date().getTime();
      const startTime = new Date(event.startTime).getTime();
      const endTime = new Date(event.endTime).getTime();
  
      let statusEvent = 'Upcoming';
      if (currentTime > startTime && currentTime < endTime) {
        statusEvent = 'Ongoing';
      } else if (currentTime > endTime) {
        statusEvent = 'Ended';
      }
  
      if (statusEvent !== 'Ended') {
        return res.status(400).send({ message: 'Event has not ended yet or does not exist.' });
      }
  
      const purchasedTicket = await prisma.ticket.findFirst({
        where: { userId, eventId, status: 'PAID' },
      });
  
      if (!purchasedTicket) {
        return res.status(400).send({ message: 'User has not purchased this event.' });
      }
  
      const newTestimonial = await prisma.testimonial.create({
        data: { userId, eventId, reviewDescription, rating },
      });
  
      res.json(newTestimonial);
    } catch (error) {
      res.status(500).send({ message: 'Failed to create testimonial.', error });
    }
  }
  
  async readTestimonial(req: Request, res: Response) {
    const { eventId } = req.params;
  
    try {
            const testimonials = await prisma.testimonial.findMany({
        where: { eventId: parseInt(eventId, 10) },
      });
  
      if (testimonials.length === 0) {
        return res.status(404).send({ message: 'No testimonials found for this event.' });
      }
  
      res.status(200).send(testimonials);
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve testimonials.', error });
    }
  }
    async updateTestimonial(req: Request, res: Response) {
    const { id } = req.params;
    const { reviewDescription, rating } = req.body;

    try {
      const testimonial = await prisma.testimonial.update({
        where: { id: parseInt(id, 10) },
        data: { reviewDescription, rating },
      });

      res.status(200).send(testimonial);
    } catch (error) {
      res.status(500).send({ message: 'Failed to update testimonial.', error });
    }
  }

  async deleteTestimonial(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.testimonial.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(200).send({ message: 'Testimonial deleted successfully.' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to delete testimonial.', error });
    } 
  }
}
//  example post 
// {
//   "userId": 1,
//   "eventId": 2,
//   "reviewDescription": "The event was amazing, well-organized, and very informative!",
//   "rating": 5
// }

// example writte json.body to output from field form json.body 
// have effect if event closed status and done buy user can comment because is before done buy event 
// around comment user can Crud card event if user needed 
// dont forget .json change .send to term code standar 



