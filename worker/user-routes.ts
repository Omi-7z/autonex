import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, notFound, bad } from './core-utils';
import { VendorEntity, BookingEntity } from "./entities";
import type { CreateBookingPayload, Booking, AIIntakeResponse, AISuggestionResponse } from "@shared/types";
import { MOCK_VENDOR_SERVICES } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Seed vendors on first request if needed
  let seeded = false;
  app.use('/api/*', async (c, next) => {
    if (!seeded) {
      await VendorEntity.ensureSeed(c.env);
      // Let's create a mock completed booking for testing garage history
      const mockCompletedBooking: Booking = {
        id: 'mock-completed-1',
        userId: 'mock-user-id',
        vendorId: 'v1',
        vendorName: 'Precision Auto Works',
        date: new Date('2023-10-15'),
        time: '09:00 AM',
        needsHumanReview: false,
        status: 'completed',
        services: [{ id: 's2-v1', name: 'AC System Check & Recharge', description: 'Inspect for leaks and recharge refrigerant.', price: 180.00, category: 'Mechanical' }],
      };
      const bookingEntity = new BookingEntity(c.env, mockCompletedBooking.id);
      if (!(await bookingEntity.exists())) {
        await BookingEntity.create(c.env, mockCompletedBooking);
      }
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
  // GET VENDOR SERVICES
  app.get('/api/vendors/:id/services', async (c) => {
    const { id } = c.req.param();
    const services = MOCK_VENDOR_SERVICES[id];
    if (!services) {
      return ok(c, { bundles: [], items: [] });
    }
    return ok(c, services);
  });
  // CREATE BOOKING
  app.post('/api/bookings', async (c) => {
    const payload = await c.req.json<CreateBookingPayload>();
    if (!payload.vendorId || !payload.date || !payload.time || !payload.services) {
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
      services: payload.services,
    };
    await BookingEntity.create(c.env, newBooking);
    return ok(c, newBooking);
  });
  // UPDATE BOOKING STATUS (ADMIN)
  app.patch('/api/bookings/:id/status', async (c) => {
    const { id } = c.req.param();
    const { status, adminNotes } = await c.req.json<{ status: Booking['status'], adminNotes?: string }>();
    if (!status) {
      return bad(c, 'Status is required.');
    }
    const bookingEntity = new BookingEntity(c.env, id);
    if (!(await bookingEntity.exists())) {
      return notFound(c, 'Booking not found');
    }
    await bookingEntity.patch({ status, adminNotes, needsHumanReview: false });
    const updatedBooking = await bookingEntity.getState();
    return ok(c, updatedBooking);
  });
  // GET GARAGE HISTORY
  app.get('/api/garage/history', async (c) => {
    const { items: allBookings } = await BookingEntity.list(c.env);
    // In a real app, you'd filter by the authenticated user's ID
    const completedBookings = allBookings.filter(b => b.status === 'completed' && b.userId === 'mock-user-id');
    return ok(c, completedBookings);
  });
  // POST DISPUTE
  app.post('/api/bookings/:id/dispute', async (c) => {
    const { id } = c.req.param();
    const { reason } = await c.req.json<{ reason: string }>();
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return bad(c, 'A reason for the dispute is required.');
    }
    const bookingEntity = new BookingEntity(c.env, id);
    if (!(await bookingEntity.exists())) {
      return notFound(c, 'Booking not found');
    }
    await bookingEntity.patch({
      dispute: {
        reason: reason.trim(),
        submittedAt: new Date(),
      },
      status: 'action_required', // Flag for admin attention
    });
    const updatedBooking = await bookingEntity.getState();
    return ok(c, updatedBooking);
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
  // POST AI INTAKE (MOCK)
  app.post('/api/ai/intake', async (c) => {
    const { query } = await c.req.json<{ query: string }>();
    await new Promise(res => setTimeout(res, 1000)); // Simulate AI processing
    const lowerQuery = query.toLowerCase();
    let searchTerm = query;
    let category = 'all';
    if (lowerQuery.includes('brake') || lowerQuery.includes('engine') || lowerQuery.includes('transmission')) {
      searchTerm = 'Mechanical Repair';
      category = 'Mechanical';
    } else if (lowerQuery.includes('oil') || lowerQuery.includes('tire')) {
      searchTerm = 'Quick Service';
      category = 'Quick Service';
    } else if (lowerQuery.includes('dent') || lowerQuery.includes('scratch') || lowerQuery.includes('windshield') || lowerQuery.includes('glass')) {
      searchTerm = 'Body & Glass';
      category = 'Body/Glass';
    } else if (lowerQuery.includes('noise') || lowerQuery.includes('light') || lowerQuery.includes('check')) {
      searchTerm = 'Diagnostics';
      category = 'Diagnostics';
    }
    return ok(c, { searchTerm, category } as AIIntakeResponse);
  });
  // POST AI SUGGEST SERVICE (MOCK)
  app.post('/api/ai/suggest-service', async (c) => {
    const { vendorId, query } = await c.req.json<{ vendorId: string, query: string }>();
    await new Promise(res => setTimeout(res, 800)); // Simulate AI processing
    const vendorServices = MOCK_VENDOR_SERVICES[vendorId];
    if (!vendorServices) {
      return notFound(c, 'No services found for this vendor.');
    }
    const allServices = [...vendorServices.items, ...vendorServices.bundles.flatMap(b => b.items)];
    const lowerQuery = query.toLowerCase();
    let suggestedService = allServices[0]; // Default to first service
    if (lowerQuery.includes('brake')) {
      suggestedService = allServices.find(s => s.name.toLowerCase().includes('brake')) || suggestedService;
    } else if (lowerQuery.includes('engine') || lowerQuery.includes('noise')) {
      suggestedService = allServices.find(s => s.category === 'Diagnostics') || suggestedService;
    } else if (lowerQuery.includes('oil')) {
      suggestedService = allServices.find(s => s.name.toLowerCase().includes('oil')) || suggestedService;
    }
    return ok(c, {
      serviceId: suggestedService.id,
      reason: `Based on your description of "${query}", this service seems like a good starting point.`,
    } as AISuggestionResponse);
  });
}