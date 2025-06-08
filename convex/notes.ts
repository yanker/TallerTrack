import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Listar notas del usuario actual
export const listNotes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const notes = await ctx.db      .query('notes')
      .filter((q) => q.eq(q.field('tokenIdentifier'), identity.tokenIdentifier))
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
  handler: async (ctx, args) => {    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    await ctx.db.insert('notes', {
      title: args.title,
      details: args.details,
      date: args.date,
      tokenIdentifier: identity.tokenIdentifier,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }    const note = await ctx.db.get(args.noteId);
    if (!note || note.tokenIdentifier !== identity.tokenIdentifier) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }    const note = await ctx.db.get(args.noteId);
    if (!note || note.tokenIdentifier !== identity.tokenIdentifier) {
      throw new Error('Note not found or unauthorized');
    }

    await ctx.db.delete(args.noteId);
  },
});
