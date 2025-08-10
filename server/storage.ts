import { users, analysisProjects, incidents, rcaResults, actionItems, type User, type InsertUser, type AnalysisProject, type InsertAnalysisProject, type Incident, type InsertIncident, type RcaResult, type InsertRcaResult, type ActionItem, type InsertActionItem } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Analysis Project methods
  getAnalysisProject(id: string): Promise<AnalysisProject | undefined>;
  getUserAnalysisProjects(userId: string): Promise<AnalysisProject[]>;
  createAnalysisProject(project: InsertAnalysisProject): Promise<AnalysisProject>;
  updateAnalysisProject(id: string, project: Partial<AnalysisProject>): Promise<AnalysisProject | undefined>;
  deleteAnalysisProject(id: string): Promise<boolean>;

  // Incident methods
  getIncident(id: string): Promise<Incident | undefined>;
  getUserIncidents(userId: string): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: string, incident: Partial<Incident>): Promise<Incident | undefined>;
  deleteIncident(id: string): Promise<boolean>;

  // RCA Result methods
  getRcaResult(id: string): Promise<RcaResult | undefined>;
  getRcaResultByIncidentId(incidentId: string): Promise<RcaResult | undefined>;
  createRcaResult(rcaResult: InsertRcaResult): Promise<RcaResult>;
  updateRcaResult(id: string, rcaResult: Partial<RcaResult>): Promise<RcaResult | undefined>;

  // Action Item methods
  getActionItem(id: string): Promise<ActionItem | undefined>;
  getActionItemsByRcaResultId(rcaResultId: string): Promise<ActionItem[]>;
  createActionItem(actionItem: InsertActionItem): Promise<ActionItem>;
  updateActionItem(id: string, actionItem: Partial<ActionItem>): Promise<ActionItem | undefined>;
  deleteActionItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, AnalysisProject>;
  private incidents: Map<string, Incident>;
  private rcaResults: Map<string, RcaResult>;
  private actionItems: Map<string, ActionItem>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.incidents = new Map();
    this.rcaResults = new Map();
    this.actionItems = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...userData, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Analysis Project methods
  async getAnalysisProject(id: string): Promise<AnalysisProject | undefined> {
    return this.projects.get(id);
  }

  async getUserAnalysisProjects(userId: string): Promise<AnalysisProject[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createAnalysisProject(insertProject: InsertAnalysisProject): Promise<AnalysisProject> {
    const id = crypto.randomUUID();
    const project: AnalysisProject = { 
      ...insertProject, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateAnalysisProject(id: string, projectData: Partial<AnalysisProject>): Promise<AnalysisProject | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: AnalysisProject = { 
      ...project, 
      ...projectData, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteAnalysisProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Incident methods
  async getIncident(id: string): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async getUserIncidents(userId: string): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.userId === userId,
    );
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = crypto.randomUUID();
    const incident: Incident = { 
      ...insertIncident, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: string, incidentData: Partial<Incident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident: Incident = { 
      ...incident, 
      ...incidentData, 
      updatedAt: new Date() 
    };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async deleteIncident(id: string): Promise<boolean> {
    return this.incidents.delete(id);
  }

  // RCA Result methods
  async getRcaResult(id: string): Promise<RcaResult | undefined> {
    return this.rcaResults.get(id);
  }

  async getRcaResultByIncidentId(incidentId: string): Promise<RcaResult | undefined> {
    return Array.from(this.rcaResults.values()).find(
      (result) => result.incidentId === incidentId,
    );
  }

  async createRcaResult(insertRcaResult: InsertRcaResult): Promise<RcaResult> {
    const id = crypto.randomUUID();
    const rcaResult: RcaResult = { 
      ...insertRcaResult, 
      id,
      createdAt: new Date()
    };
    this.rcaResults.set(id, rcaResult);
    return rcaResult;
  }

  async updateRcaResult(id: string, rcaResultData: Partial<RcaResult>): Promise<RcaResult | undefined> {
    const rcaResult = this.rcaResults.get(id);
    if (!rcaResult) return undefined;
    
    const updatedRcaResult: RcaResult = { 
      ...rcaResult, 
      ...rcaResultData
    };
    this.rcaResults.set(id, updatedRcaResult);
    return updatedRcaResult;
  }

  // Action Item methods
  async getActionItem(id: string): Promise<ActionItem | undefined> {
    return this.actionItems.get(id);
  }

  async getActionItemsByRcaResultId(rcaResultId: string): Promise<ActionItem[]> {
    return Array.from(this.actionItems.values()).filter(
      (item) => item.rcaResultId === rcaResultId,
    );
  }

  async createActionItem(insertActionItem: InsertActionItem): Promise<ActionItem> {
    const id = crypto.randomUUID();
    const actionItem: ActionItem = { 
      ...insertActionItem, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.actionItems.set(id, actionItem);
    return actionItem;
  }

  async updateActionItem(id: string, actionItemData: Partial<ActionItem>): Promise<ActionItem | undefined> {
    const actionItem = this.actionItems.get(id);
    if (!actionItem) return undefined;
    
    const updatedActionItem: ActionItem = { 
      ...actionItem, 
      ...actionItemData, 
      updatedAt: new Date() 
    };
    this.actionItems.set(id, updatedActionItem);
    return updatedActionItem;
  }

  async deleteActionItem(id: string): Promise<boolean> {
    return this.actionItems.delete(id);
  }
}

export const storage = new MemStorage();
