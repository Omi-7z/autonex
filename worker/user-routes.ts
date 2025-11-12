import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok } from './core-utils';
import { MOCK_VENDORS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'AutoNex API' }}));
  // VENDORS
  app.get('/api/vendors', async (c) => {
    // In a real app, this would fetch from a DB/DO
    // For Phase 1, we return static mock data.
    return ok(c, MOCK_VENDORS);
  });
}