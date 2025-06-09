import { mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

// Función especial para la inicialización inicial (sin requerir autenticación)
export const forceInitializeUserRoles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const updates = [];

    for (const user of users) {
      // Verificar si ya tiene un perfil
      const existingProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user_id', (q) => q.eq('userId', user._id))
        .first();

      if (!existingProfile) {
        // Asignar ADMIN solo a yanker@gmail.com, USER al resto
        const role = user.email === 'yanker@gmail.com' ? 'ADMIN' : 'USER';
        const profileId = await ctx.db.insert('userProfiles', {
          userId: user._id,
          role: role,
        });
        updates.push({ email: user.email, role: role });
      }
    }

    return {
      message: 'Roles de usuario inicializados',
      updates: updates,
    };
  },
});

// Función para actualizar los roles de usuario
export const initializeUserRoles = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const updates = [];

    for (const user of users) {
      // Verificar si ya tiene un perfil
      const existingProfile = await ctx.db
        .query('userProfiles')
        .withIndex('by_user_id', (q) => q.eq('userId', user._id))
        .first();

      if (!existingProfile) {
        // Asignar ADMIN solo a yanker@gmail.com, USER al resto
        const role = user.email === 'yanker@gmail.com' ? 'ADMIN' : 'USER';
        const profileId = await ctx.db.insert('userProfiles', {
          userId: user._id,
          role: role,
        });
        updates.push({ userId: user._id, role: role, profileId });
      }
    }

    return {
      message: 'Roles de usuario inicializados',
      updates: updates,
    };
  },
});

export const cloneUserData = mutation({
  args: {
    sourceUserId: v.id('users'),
    targetUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // 1. Obtener todos los vehículos del usuario origen
    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
      .collect();

    // Mapa para mantener la relación entre IDs antiguos y nuevos de vehículos
    const vehicleIdMap = new Map();

    // 2. Clonar vehículos
    for (const vehicle of vehicles) {
      const { _id, _creationTime, userId: _userId, ...vehicleData } = vehicle;
      const newVehicleId = await ctx.db.insert('vehicles', {
        ...vehicleData,
        userId: args.targetUserId,
      });
      vehicleIdMap.set(_id, newVehicleId);
    }

    // 3. Clonar registros de mantenimiento
    const maintenanceRecords = await ctx.db
      .query('maintenanceRecords')
      .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
      .collect();

    for (const record of maintenanceRecords) {
      const { _id, _creationTime, userId: _userId, vehicleId, ...recordData } = record;
      const newVehicleId = vehicleIdMap.get(vehicleId);
      if (newVehicleId) {
        await ctx.db.insert('maintenanceRecords', {
          ...recordData,
          userId: args.targetUserId,
          vehicleId: newVehicleId,
        });
      }
    }

    // 4. Clonar mantenimientos programados
    const scheduledMaintenance = await ctx.db
      .query('scheduledMaintenance')
      .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
      .collect();

    for (const scheduled of scheduledMaintenance) {
      const { _id, _creationTime, userId: _userId, vehicleId, ...scheduledData } = scheduled;
      const newVehicleId = vehicleIdMap.get(vehicleId);
      if (newVehicleId) {
        await ctx.db.insert('scheduledMaintenance', {
          ...scheduledData,
          userId: args.targetUserId,
          vehicleId: newVehicleId,
        });
      }
    }

    // 5. Clonar notas
    const notes = await ctx.db
      .query('notes')
      .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
      .collect();

    for (const note of notes) {
      const { _id, _creationTime, userId: _userId, ...noteData } = note;
      await ctx.db.insert('notes', {
        ...noteData,
        userId: args.targetUserId,
      });
    }

    return {
      message: 'Datos clonados exitosamente',
      stats: {
        vehicles: vehicles.length,
        maintenanceRecords: maintenanceRecords.length,
        scheduledMaintenance: scheduledMaintenance.length,
        notes: notes.length,
      },
    };
  },
});