import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setupAdminUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if admin user already exists
    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "yanker@gmail.com"))
      .first();
    
    if (existingAdmin) {
      // Check if profile exists
      const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user_id", (q) => q.eq("userId", existingAdmin._id))
        .first();
      
      if (!profile) {
        await ctx.db.insert("userProfiles", {
          userId: existingAdmin._id,
          role: "ADMIN",
          name: "Administrator",
        });
      }
      
      return "Admin user already exists";
    }
    
    return "Admin user needs to be created through sign up";
  },
});
