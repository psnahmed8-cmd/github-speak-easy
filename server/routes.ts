import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserSchema, insertAnalysisProjectSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Validate input
      const userData = insertUserSchema.parse({ name, email, password });
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user data without password
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse, token });
    } catch (error) {
      console.error('Register error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input data' });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user data without password
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Protected routes
  app.get('/api/user/profile', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.put('/api/user/profile', authenticateToken, async (req: any, res) => {
    try {
      const { name, company, role } = req.body;
      const user = await storage.updateUser(req.user.userId, { name, company, role });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Analysis Projects routes
  app.get('/api/projects', authenticateToken, async (req: any, res) => {
    try {
      const projects = await storage.getUserAnalysisProjects(req.user.userId);
      res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', authenticateToken, async (req: any, res) => {
    try {
      const projectData = insertAnalysisProjectSchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const project = await storage.createAnalysisProject(projectData);
      res.json(project);
    } catch (error) {
      console.error('Create project error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid project data' });
      }
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get('/api/projects/:id', authenticateToken, async (req: any, res) => {
    try {
      const project = await storage.getAnalysisProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Ensure user owns the project
      if (project.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.put('/api/projects/:id', authenticateToken, async (req: any, res) => {
    try {
      // First check if project exists and user owns it
      const existingProject = await storage.getAnalysisProject(req.params.id);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      if (existingProject.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const project = await storage.updateAnalysisProject(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', authenticateToken, async (req: any, res) => {
    try {
      // First check if project exists and user owns it
      const existingProject = await storage.getAnalysisProject(req.params.id);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      if (existingProject.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const deleted = await storage.deleteAnalysisProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Analysis route (porting from Supabase Edge Function)
  app.post('/api/analyze', authenticateToken, async (req: any, res) => {
    try {
      const { projectId, analysisType = 'root_cause' } = req.body;
      
      if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required' });
      }
      
      // Get project and ensure user owns it
      const project = await storage.getAnalysisProject(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      if (project.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Mock analysis results (replace with actual AI analysis later)
      const analysisResults = {
        analysisType,
        timestamp: new Date().toISOString(),
        summary: {
          totalDataPoints: Math.floor(Math.random() * 1000) + 100,
          identifiedIssues: Math.floor(Math.random() * 10) + 1,
          confidenceScore: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100,
        },
        rootCauses: [
          {
            id: '1',
            description: 'Equipment vibration exceeding normal parameters',
            probability: 0.85,
            impact: 'High',
            category: 'Mechanical'
          },
          {
            id: '2', 
            description: 'Temperature fluctuations in Process Unit A',
            probability: 0.72,
            impact: 'Medium',
            category: 'Process'
          },
          {
            id: '3',
            description: 'Inconsistent raw material quality',
            probability: 0.68,
            impact: 'Medium',
            category: 'Material'
          }
        ],
        recommendations: [
          'Schedule immediate equipment inspection and calibration',
          'Implement enhanced temperature monitoring system',
          'Review supplier quality standards and contracts'
        ],
        chartData: {
          timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: Math.random() * 100 + 50,
            anomaly: Math.random() > 0.8
          })),
          categoryData: [
            { category: 'Mechanical', count: 3, severity: 'High' },
            { category: 'Process', count: 2, severity: 'Medium' },
            { category: 'Material', count: 1, severity: 'Low' },
            { category: 'Environmental', count: 1, severity: 'Low' }
          ]
        }
      };
      
      // Update project with analysis results
      const updatedProject = await storage.updateAnalysisProject(projectId, {
        analysisResults,
        status: 'completed'
      });
      
      res.json({ 
        success: true, 
        analysisResults,
        message: 'Analysis completed successfully' 
      });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
