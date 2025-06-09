import { mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';

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
        await ctx.db.insert('userProfiles', {
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
        await ctx.db.insert('userProfiles', {
          userId: user._id,
          role: role,
        });
        updates.push({ userId: user._id, role: role });
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
    // Verificar que ambos usuarios existen
    const sourceUser = await ctx.db.get(args.sourceUserId);
    const targetUser = await ctx.db.get(args.targetUserId);

    if (!sourceUser) {
      throw new Error('Usuario origen no encontrado');
    }
    if (!targetUser) {
      throw new Error('Usuario destino no encontrado');
    }

    // Verificar que no es el mismo usuario
    if (args.sourceUserId === args.targetUserId) {
      throw new Error('No se pueden clonar datos al mismo usuario');
    }

    // Obtener los perfiles de usuario
    const sourceProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
      .first();

    const targetProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.targetUserId))
      .first();

    if (!sourceProfile || !targetProfile) {
      // Intentar crear perfiles si no existen
      if (!sourceProfile) {
        await ctx.db.insert('userProfiles', {
          userId: args.sourceUserId,
          role: 'USER',
        });
      }
      if (!targetProfile) {
        await ctx.db.insert('userProfiles', {
          userId: args.targetUserId,
          role: 'USER',
        });
      }
    }

    // Verificar roles después de asegurarnos que existen los perfiles
    const updatedSourceProfile =
      sourceProfile ||
      (await ctx.db
        .query('userProfiles')
        .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
        .first());
    const updatedTargetProfile =
      targetProfile ||
      (await ctx.db
        .query('userProfiles')
        .withIndex('by_user_id', (q) => q.eq('userId', args.targetUserId))
        .first());

    if (!updatedSourceProfile || !updatedTargetProfile) {
      throw new Error('Error al verificar los perfiles de usuario');
    }

    // No permitir clonar datos desde un admin
    if (updatedSourceProfile.role === 'ADMIN') {
      throw new Error('No se pueden clonar datos desde un usuario administrador');
    }

    // No permitir clonar datos hacia un admin
    if (updatedTargetProfile.role === 'ADMIN') {
      throw new Error('No se pueden clonar datos a un usuario administrador');
    }

    // 1. Borrar todos los datos existentes del usuario destino
    const existingVehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.targetUserId))
      .collect();

    for (const vehicle of existingVehicles) {
      // Borrar registros de mantenimiento asociados
      const records = await ctx.db
        .query('maintenanceRecords')
        .withIndex('by_vehicle_id', (q) => q.eq('vehicleId', vehicle._id))
        .collect();

      for (const record of records) {
        await ctx.db.delete(record._id);
      }

      // Borrar mantenimientos programados asociados
      const scheduled = await ctx.db
        .query('scheduledMaintenance')
        .withIndex('by_vehicle_id', (q) => q.eq('vehicleId', vehicle._id))
        .collect();

      for (const item of scheduled) {
        await ctx.db.delete(item._id);
      }

      // Borrar el vehículo
      await ctx.db.delete(vehicle._id);
    }

    // Borrar notas existentes
    const existingNotes = await ctx.db
      .query('notes')
      .withIndex('by_user_id', (q) => q.eq('userId', args.targetUserId))
      .collect();

    for (const note of existingNotes) {
      await ctx.db.delete(note._id);
    }

    // 2. Obtener todos los vehículos del usuario origen
    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.sourceUserId))
      .collect();

    // Mapa para mantener la relación entre IDs antiguos y nuevos de vehículos
    const vehicleIdMap = new Map();

    // 3. Clonar vehículos
    for (const vehicle of vehicles) {
      const { _id, _creationTime, userId: _userId, ...vehicleData } = vehicle;
      const newVehicleId = await ctx.db.insert('vehicles', {
        ...vehicleData,
        userId: args.targetUserId,
      });
      vehicleIdMap.set(_id, newVehicleId);
    }

    // 4. Clonar registros de mantenimiento
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

    // 5. Clonar mantenimientos programados
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

    // 6. Clonar notas
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
        vehiclesDeleted: existingVehicles.length,
        notesDeleted: existingNotes.length,
        vehiclesCloned: vehicles.length,
        maintenanceRecords: maintenanceRecords.length,
        scheduledMaintenance: scheduledMaintenance.length,
        notesCloned: notes.length,
      },
    };
  },
});