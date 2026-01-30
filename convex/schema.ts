import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  idCards: defineTable({
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
  }),
});
