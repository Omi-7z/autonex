import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, notFound } from './core-utils';
import { MOCK_VENDORS, MOCK_SERVICE_HISTORY, MOCK_REVIEW_QUEUE } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'AutoNex API' }}));
  // GET ALL VENDORS
  app.get('/api/vendors', async (c) => {
    return ok(c, MOCK_VENDORS);
  });
  // GET VENDOR BY ID
  app.get('/api/vendors/:id', async (c) => {
    const { id } = c.req.param();
    const vendor = MOCK_VENDORS.find(v => v.id === id);
    if (!vendor) {
      return notFound(c, 'Vendor not found');
    }
    return ok(c, vendor);
  });
  // GET GARAGE HISTORY
  app.get('/api/garage/history', async (c) => {
    return ok(c, MOCK_SERVICE_HISTORY);
  });
  // GET ADMIN REVIEW QUEUE
  app.get('/api/admin/review-queue', async (c) => {
    return ok(c, MOCK_REVIEW_QUEUE);
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