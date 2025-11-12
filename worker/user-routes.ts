import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, notFound, bad } from './core-utils';
import { VendorEntity, BookingEntity } from "./entities";
import type { CreateBookingPayload, Booking } from "@shared/types";
import { MOCK_SERVICE_HISTORY } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Seed vendors on first request if needed
  let seeded = false;
  app.use('/api/*', async (c, next) => {
    if (!seeded) {
      await VendorEntity.ensureSeed(c.env);
      seeded = true;
    }
    await next();
  });
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'AutoNex API' }}));
  // GET ALL VENDORS
  app.get('/api/vendors', async (c) => {
    const { items } = await VendorEntity.list(c.env);
    return ok(c, items);
  });
  // GET VENDOR BY ID
  app.get('/api/vendors/:id', async (c) => {
    const { id } = c.req.param();
    const vendorEntity = new VendorEntity(c.env, id);
    if (!(await vendorEntity.exists())) {
      return notFound(c, 'Vendor not found');
    }
    const vendor = await vendorEntity.getState();
    return ok(c, vendor);
  });
  // CREATE BOOKING
  app.post('/api/bookings', async (c) => {
    const payload = await c.req.json<CreateBookingPayload>();
    if (!payload.vendorId || !payload.date || !payload.time) {
      return bad(c, 'Missing required booking information.');
    }
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId: 'mock-user-id', // Placeholder for auth
      vendorId: payload.vendorId,
      vendorName: payload.vendorName,
      date: new Date(payload.date),
      time: payload.time,
      needsHumanReview: payload.needsReview,
      status: 'confirmed',
    };
    await BookingEntity.create(c.env, newBooking);
    return ok(c, newBooking);
  });
  // GET GARAGE HISTORY (still mock)
  app.get('/api/garage/history', async (c) => {
    return ok(c, MOCK_SERVICE_HISTORY);
  });
  // GET ADMIN REVIEW QUEUE
  app.get('/api/admin/review-queue', async (c) => {
    const { items: allBookings } = await BookingEntity.list(c.env);
    const reviewQueue = allBookings.filter(b => b.needsHumanReview).map(b => ({
      id: b.id,
      customerName: `User ${b.userId.substring(0, 6)}`, // Mock customer name
      vendorName: b.vendorName,
      date: b.date,
      time: b.time,
      status: 'Needs Review' as const,
    }));
    return ok(c, reviewQueue);
  });
  // POST TRANSLATE QUOTE (MOCK)
  app.post('/api/translate-quote', async (c) => {
    // Simulate processing delay
    await new Promise(res => setTimeout(res, 1500));
    const mockAnalysis = {
      totalCost: 750.50,
      lineItems: [
        { item: "Labor", cost: 300.00, notes: "Standard rate, seems fair." },
        { item: "Part #XYZ-123", cost: 450.50, notes: "This part seems overpriced by ~15% compared to market rate." },
      ],
      summary: "The quote appears reasonable, but one part is marked up higher than average. You could potentially save money by sourcing this part yourself.",
    };
    return ok(c, mockAnalysis);
  });
}