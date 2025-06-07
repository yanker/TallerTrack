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

export const listVehicles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    
    return await ctx.db
      .query("vehicles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createVehicle = mutation({
  args: {
    purchaseDate: v.string(),
    initialKm: v.number(),
    brand: v.string(),
    model: v.string(),
    licensePlate: v.string(),
    otherDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    return await ctx.db.insert("vehicles", {
      userId,
      ...args,
    });
  },
});

export const updateVehicle = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    purchaseDate: v.string(),
    initialKm: v.number(),
    brand: v.string(),
    model: v.string(),
    licensePlate: v.string(),
    otherDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or access denied");
    }
    
    const { vehicleId, ...updateData } = args;
    await ctx.db.patch(vehicleId, updateData);
  },
});

export const deleteVehicle = mutation({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or access denied");
    }
    
    // Delete related maintenance records
    const records = await ctx.db
      .query("maintenanceRecords")
      .withIndex("by_vehicle_id", (q) => q.eq("vehicleId", args.vehicleId))
      .collect();
    
    for (const record of records) {
      await ctx.db.delete(record._id);
    }
    
    // Delete related scheduled maintenance
    const scheduled = await ctx.db
      .query("scheduledMaintenance")
      .withIndex("by_vehicle_id", (q) => q.eq("vehicleId", args.vehicleId))
      .collect();
    
    for (const item of scheduled) {
      await ctx.db.delete(item._id);
    }
    
    await ctx.db.delete(args.vehicleId);
  },
});
