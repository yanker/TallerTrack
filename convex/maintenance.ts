import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}

function calculateVehicleAge(purchaseDate: string, repairDate: string): number {
  const purchase = new Date(purchaseDate);
  const repair = new Date(repairDate);
  const diffTime = Math.abs(repair.getTime() - purchase.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(diffYears * 100) / 100; // Round to 2 decimal places
}

export const listMaintenanceRecords = query({
  args: {
    vehicleId: v.optional(v.id("vehicles")),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    let query = ctx.db
      .query("maintenanceRecords")
      .withIndex("by_user_id", (q) => q.eq("userId", userId));
    
    const records = await query.collect();
    
    // Get vehicle details for each record
    const recordsWithVehicles = await Promise.all(
      records.map(async (record) => {
        const vehicle = await ctx.db.get(record.vehicleId);
        return {
          ...record,
          vehicle,
        };
      })
    );
    
    // Filter by vehicle if specified
    let filteredRecords = recordsWithVehicles;
    if (args.vehicleId) {
      filteredRecords = recordsWithVehicles.filter(
        (record) => record.vehicleId === args.vehicleId
      );
    }
    
    // Filter by search term if specified
    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter(
        (record) =>
          record.observations.toLowerCase().includes(searchLower) ||
          record.vehicle?.brand.toLowerCase().includes(searchLower) ||
          record.vehicle?.model.toLowerCase().includes(searchLower) ||
          record.vehicle?.licensePlate.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredRecords.sort((a, b) => 
      new Date(b.repairDate).getTime() - new Date(a.repairDate).getTime()
    );
  },
});

export const createMaintenanceRecord = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    repairDate: v.string(),
    currentKm: v.number(),
    observations: v.string(),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or access denied");
    }
    
    const vehicleAge = calculateVehicleAge(vehicle.purchaseDate, args.repairDate);
    
    return await ctx.db.insert("maintenanceRecords", {
      userId,
      vehicleId: args.vehicleId,
      repairDate: args.repairDate,
      currentKm: args.currentKm,
      vehicleAge,
      observations: args.observations,
      cost: args.cost,
    });
  },
});

export const updateMaintenanceRecord = mutation({
  args: {
    recordId: v.id("maintenanceRecords"),
    vehicleId: v.id("vehicles"),
    repairDate: v.string(),
    currentKm: v.number(),
    observations: v.string(),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const record = await ctx.db.get(args.recordId);
    if (!record || record.userId !== userId) {
      throw new Error("Record not found or access denied");
    }
    
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or access denied");
    }
    
    const vehicleAge = calculateVehicleAge(vehicle.purchaseDate, args.repairDate);
    
    await ctx.db.patch(args.recordId, {
      vehicleId: args.vehicleId,
      repairDate: args.repairDate,
      currentKm: args.currentKm,
      vehicleAge,
      observations: args.observations,
      cost: args.cost,
    });
  },
});

export const deleteMaintenanceRecord = mutation({
  args: { recordId: v.id("maintenanceRecords") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const record = await ctx.db.get(args.recordId);
    if (!record || record.userId !== userId) {
      throw new Error("Record not found or access denied");
    }
    
    await ctx.db.delete(args.recordId);
  },
});

export const exportMaintenanceRecords = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    
    const records = await ctx.db
      .query("maintenanceRecords")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    
    const recordsWithVehicles = await Promise.all(
      records.map(async (record) => {
        const vehicle = await ctx.db.get(record.vehicleId);
        return {
          fecha: record.repairDate,
          marca: vehicle?.brand || "",
          modelo: vehicle?.model || "",
          matricula: vehicle?.licensePlate || "",
          kilometros: record.currentKm,
          edad_vehiculo: record.vehicleAge,
          observaciones: record.observations.replace(/<[^>]*>/g, ''), // Strip HTML
          coste: record.cost || 0,
        };
      })
    );
    
    return recordsWithVehicles.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  },
});
