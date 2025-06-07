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

export const listScheduledMaintenance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    
    const scheduled = await ctx.db
      .query("scheduledMaintenance")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    
    const scheduledWithVehicles = await Promise.all(
      scheduled.map(async (item) => {
        const vehicle = await ctx.db.get(item.vehicleId);
        return {
          ...item,
          vehicle,
        };
      })
    );
    
    return scheduledWithVehicles;
  },
});

export const getUpcomingMaintenance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    
    const scheduled = await ctx.db
      .query("scheduledMaintenance")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    
    const upcomingMaintenance = [];
    
    for (const item of scheduled) {
      if (!item.isActive) continue;
      
      const vehicle = await ctx.db.get(item.vehicleId);
      if (!vehicle) continue;
      
      // Get latest maintenance record for this vehicle
      const latestRecord = await ctx.db
        .query("maintenanceRecords")
        .withIndex("by_vehicle_id", (q) => q.eq("vehicleId", item.vehicleId))
        .order("desc")
        .first();
      
      const vehiclePurchaseDate = new Date(vehicle.purchaseDate);
      const currentDate = new Date();
      
      let isUpcoming = false;
      let nextDueInfo = "";
      
      if (item.everyXYears) {
        const lastMaintenanceDate = latestRecord 
          ? new Date(latestRecord.repairDate)
          : vehiclePurchaseDate;
        
        const yearsSinceLastMaintenance = 
          (currentDate.getTime() - lastMaintenanceDate.getTime()) / 
          (1000 * 60 * 60 * 24 * 365.25);
        
        if (yearsSinceLastMaintenance >= item.everyXYears) {
          isUpcoming = true;
          nextDueInfo = `Vencido por ${Math.round((yearsSinceLastMaintenance - item.everyXYears) * 10) / 10} años`;
        } else {
          const yearsRemaining = item.everyXYears - yearsSinceLastMaintenance;
          if (yearsRemaining <= 0.5) { // Show if due within 6 months
            isUpcoming = true;
            nextDueInfo = `Próximo en ${Math.round(yearsRemaining * 12)} meses`;
          }
        }
      }
      
      if (item.everyXKm) {
        const baseKm = latestRecord ? latestRecord.currentKm : vehicle.initialKm;
        const nextMaintenanceKm = baseKm + item.everyXKm;
        const currentKm = latestRecord ? latestRecord.currentKm : vehicle.initialKm;
        
        if (currentKm >= nextMaintenanceKm) {
          isUpcoming = true;
          nextDueInfo += (nextDueInfo ? " | " : "") + 
            `Vencido por ${currentKm - nextMaintenanceKm} km`;
        } else {
          const kmRemaining = nextMaintenanceKm - currentKm;
          if (kmRemaining <= item.everyXKm * 0.1) {
            isUpcoming = true;
            nextDueInfo += (nextDueInfo ? " | " : "") + 
              `Próximo en ${kmRemaining} km`;
          }
        }
      }
      
      if (isUpcoming) {
        upcomingMaintenance.push({
          ...item,
          vehicle,
          nextDueInfo,
        });
      }
    }
    
    return upcomingMaintenance;
  },
});

export const createScheduledMaintenance = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    everyXYears: v.optional(v.number()),
    everyXKm: v.optional(v.number()),
    observations: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or access denied");
    }
    
    return await ctx.db.insert("scheduledMaintenance", {
      userId,
      vehicleId: args.vehicleId,
      everyXYears: args.everyXYears,
      everyXKm: args.everyXKm,
      observations: args.observations,
      isActive: true,
    });
  },
});

export const updateScheduledMaintenance = mutation({
  args: {
    scheduleId: v.id("scheduledMaintenance"),
    vehicleId: v.id("vehicles"),
    everyXYears: v.optional(v.number()),
    everyXKm: v.optional(v.number()),
    observations: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule || schedule.userId !== userId) {
      throw new Error("Schedule not found or access denied");
    }
    
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new Error("Vehicle not found or access denied");
    }
    
    const { scheduleId, ...updateData } = args;
    await ctx.db.patch(scheduleId, updateData);
  },
});

export const deleteScheduledMaintenance = mutation({
  args: { scheduleId: v.id("scheduledMaintenance") },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const schedule = await ctx.db.get(args.scheduleId);
    if (!schedule || schedule.userId !== userId) {
      throw new Error("Schedule not found or access denied");
    }
    
    await ctx.db.delete(args.scheduleId);
  },
});
