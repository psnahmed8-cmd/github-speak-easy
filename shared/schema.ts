import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  company: text("company"),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const analysisProjects = pgTable("analysis_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("active"),
  dataFileUrl: text("data_file_url"),
  analysisResults: jsonb("analysis_results"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const incidents = pgTable("incidents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  incidentDate: timestamp("incident_date").notNull(),
  location: text("location"),
  affectedAssets: jsonb("affected_assets"), // Array of equipment/system IDs
  systemData: jsonb("system_data"), // Sensor logs, operating mode, parameter anomalies
  maintenanceHistory: jsonb("maintenance_history"), // Service logs, repair history
  operatorFactors: jsonb("operator_factors"), // Personnel, training, interviews
  environmentalFactors: jsonb("environmental_factors"), // Weather, external conditions
  processContext: jsonb("process_context"), // Process diagrams, dependencies, changes
  riskCompliance: jsonb("risk_compliance"), // Safety-critical info, regulations
  attachments: jsonb("attachments"), // File URLs and metadata
  status: text("status").default("draft"), // draft, analyzing, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rcaResults = pgTable("rca_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  incidentId: uuid("incident_id").notNull(),
  primaryRootCauses: jsonb("primary_root_causes").notNull(), // Root causes with confidence ratings
  causalChain: jsonb("causal_chain").notNull(), // Timeline and pathway analysis
  recommendedActions: jsonb("recommended_actions").notNull(), // CAPA items with priorities
  supportingDocuments: jsonb("supporting_documents"), // Links to evidence used
  riskInsights: jsonb("risk_insights"), // Trend analysis and similar incidents
  confidenceRating: integer("confidence_rating").notNull(),
  aiAnalysisData: jsonb("ai_analysis_data"), // Raw AI processing data
  createdAt: timestamp("created_at").defaultNow(),
});

export const actionItems = pgTable("action_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  rcaResultId: uuid("rca_result_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull(), // high, medium, low
  responsibleTeam: text("responsible_team").notNull(),
  suggestedDeadline: text("suggested_deadline"),
  status: text("status").default("pending"), // pending, in-progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalysisProjectSchema = createInsertSchema(analysisProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRcaResultSchema = createInsertSchema(rcaResults).omit({
  id: true,
  createdAt: true,
});

export const insertActionItemSchema = createInsertSchema(actionItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAnalysisProject = z.infer<typeof insertAnalysisProjectSchema>;
export type AnalysisProject = typeof analysisProjects.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertRcaResult = z.infer<typeof insertRcaResultSchema>;
export type RcaResult = typeof rcaResults.$inferSelect;
export type InsertActionItem = z.infer<typeof insertActionItemSchema>;
export type ActionItem = typeof actionItems.$inferSelect;
