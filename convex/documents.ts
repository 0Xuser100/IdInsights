import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createIdCard = mutation({
  args: {
    faceImagePath: v.string(),
    backImagePath: v.string(),
    name: v.optional(v.string()),
    nationalId: v.optional(v.string()),
    address: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    religion: v.optional(v.string()),
    maritalStatus: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    rawOcrText: v.optional(v.string()),
    correctedText: v.optional(v.string()),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("idCards", args);
    return id;
  },
});

export const getAllIdCards = query({
  args: {},
  handler: async (ctx) => {
    const idCards = await ctx.db.query("idCards").order("desc").collect();
    return idCards;
  },
});

export const getIdCardById = query({
  args: { id: v.id("idCards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
