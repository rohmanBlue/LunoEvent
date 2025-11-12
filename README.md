# Event Management Platform
**Mini Project by Rohman & Afred Team**

---

## Objective
The main goal of this MVP is to build a simple and functional event management platform where:

- Event organizers can create, promote, and manage events.
- Attendees can browse, register, and provide feedback for events.

---

## Core Features

### 1. Event Discovery & Details
- Landing page with a list of events and event details.
- Fully responsive design.
- Attendees can:
  - Browse upcoming events.
  - Filter events by category or location.
  - View detailed event info.
  - Purchase tickets (free or paid).
- Implements search bar with **debounce**, filtering, and pagination.

### 2. Event Transaction & Promotion
- Organizers can create events with:
  - Event name, price, date, time, location, description.
  - Available seats and ticket types.
- Supports free and paid events (paid events charge attendees as specified).
- Organizers can create promotions:
  - Discount vouchers for limited users using referral codes.
  - Time-based discounts.
- All prices are in **IDR**.

### 3. Event Reviews & Ratings
- Attendees can leave reviews and rate events.
- Feedback includes overall experience, event quality, and suggestions for improvement.

---

### 4. User Authentication & Authorization
- Users must create an account to attend events.
- Two user roles:
  - **Customer / Participant**: Browse events & purchase tickets.
  - **Event Organizer / Promoter**: Create and sell event tickets.
- Referral system:
  - Users can register using another user’s referral number for discount coupons.
  - Referral numbers are generated for new users.
  - Points are earned each time someone uses your referral code.

---

### 5. Referral System: Points & Prizes
- Each use of your referral code gives **10,000 points**.
- Points expire **after 3 months**.
- Points can be redeemed to reduce ticket prices.
- Registering with a referral code gives **10% discount**.
- Referral-based discounts valid for **3 months**.

---

### 6. Event Management Dashboard
- Organizers can access a dashboard to:
  - View their events.
  - See attendee registrations and transactions.
  - Track basic event statistics.
- Includes: 
  - Reports by year, month, and day. 

---

## Technologies Used
- **Frontend:** React, Next.js, TailwindCSS
- **Backend:** Node.js, Express (or your backend choice)
- **Database:** PostgreSQL / MySQL / MongoDB
- **Authentication:** JWT or OAuth
- **Other:** Chart.js / Recharts for statistics

---

## Team
- **Rohman** - Frontend Developer
- **Afred** - Backend Developer
- Project inspired by real-world event management needs.

---

## How to Run
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/event-management-platform.git

