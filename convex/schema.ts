import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

const applicationTables = {
  // Extended user profile with role
  userProfiles: defineTable({
    userId: v.id('users'),
    role: v.union(v.literal('ADMIN'), v.literal('USER')),
    name: v.optional(v.string()),
  }).index('by_user_id', ['userId']),

  // Vehicles table
  vehicles: defineTable({
    userId: v.id('users'),
    purchaseDate: v.string(),
    initialKm: v.number(),
    brand: v.string(),
    model: v.string(),
    licensePlate: v.string(),
    color: v.optional(v.string()), // Color para identificación visual
    otherDetails: v.optional(v.string()),
  }).index('by_user_id', ['userId']),

  // Maintenance records
  maintenanceRecords: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    repairDate: v.string(),
    currentKm: v.number(),
    vehicleAge: v.number(), // calculated in years
    observations: v.string(),
    cost: v.optional(v.number()), // importe pagado
  })
    .index('by_user_id', ['userId'])
    .index('by_vehicle_id', ['vehicleId'])
    .index('by_date', ['repairDate']),

  // Scheduled maintenance
  scheduledMaintenance: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    everyXYears: v.optional(v.number()),
    everyXKm: v.optional(v.number()),
    observations: v.string(),
    isActive: v.boolean(),
  })
    .index('by_user_id', ['userId'])
    .index('by_vehicle_id', ['vehicleId']),
  // Notas personales
  notes: defineTable({
    userId: v.id('users'),
    title: v.string(),
    details: v.string(),
    date: v.string(),
  })
    .index('by_user_id', ['userId'])
    .index('by_date', ['date']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
