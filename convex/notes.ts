import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}

// Listar notas del usuario actual
export const listNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const notes = await ctx.db
      .query('notes')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();

    return notes;
  },
});

// Crear una nueva nota
export const createNote = mutation({
  args: {
    title: v.string(),
    details: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    await ctx.db.insert('notes', {
      userId,
      title: args.title,
      details: args.details,
      date: args.date,
    });
  },
});

// Actualizar una nota existente
export const updateNote = mutation({
  args: {
    noteId: v.id('notes'),
    title: v.string(),
    details: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== userId) {
      throw new Error('Note not found or unauthorized');
    }

    await ctx.db.patch(args.noteId, {
      title: args.title,
      details: args.details,
      date: args.date,
    });
  },
});

// Eliminar una nota
export const deleteNote = mutation({
  args: {
    noteId: v.id('notes'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    
    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== userId) {
      throw new Error('Note not found or unauthorized');
    }

    await ctx.db.delete(args.noteId);
  },
});
