import { users, analysisProjects, type User, type InsertUser, type AnalysisProject, type InsertAnalysisProject } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, AnalysisProject>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
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
}

export const storage = new MemStorage();
