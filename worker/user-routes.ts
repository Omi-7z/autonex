import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, notFound } from './core-utils';
import { MOCK_VENDORS } from "@shared/mock-data";
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
}