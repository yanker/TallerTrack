import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

// Check if user is admin
async function requireAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  
  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user_id", (q: any) => q.eq("userId", userId))
    .first();
  
  if (profile?.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  
  return userId;
}

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    
    const users = await ctx.db.query("users").collect();
    const profiles = await ctx.db.query("userProfiles").collect();
    
    return users.map(user => {
      const profile = profiles.find(p => p.userId === user._id);
      return {
        ...user,
        role: profile?.role || "USER",
        name: profile?.name || user.email,
      };
    });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    // Delete user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    
    if (profile) {
      await ctx.db.delete(profile._id);
    }
    
    // Delete user's vehicles
    const vehicles = await ctx.db
      .query("vehicles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const vehicle of vehicles) {
      await ctx.db.delete(vehicle._id);
    }
    
    // Delete user's maintenance records
    const records = await ctx.db
      .query("maintenanceRecords")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const record of records) {
      await ctx.db.delete(record._id);
    }
    
    // Delete user's scheduled maintenance
    const scheduled = await ctx.db
      .query("scheduledMaintenance")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
    
    for (const item of scheduled) {
      await ctx.db.delete(item._id);
    }
    
    // Finally delete the user
    await ctx.db.delete(args.userId);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("ADMIN"), v.literal("USER")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    
    if (profile) {
      await ctx.db.patch(profile._id, { role: args.role });
    } else {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        role: args.role,
      });
    }
  },
});
