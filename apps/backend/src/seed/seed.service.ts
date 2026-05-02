import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../entities/note.entity';

const RANDOM_WORDS = [
  // Technology & Programming
  'algorithm', 'database', 'server', 'client', 'frontend', 'backend', 'api', 'cache',
  'framework', 'library', 'module', 'component', 'function', 'variable', 'constant',
  'class', 'object', 'array', 'string', 'number', 'boolean', 'null', 'undefined',
  'react', 'angular', 'vue', 'next', 'nest', 'express', 'django', 'flask', 'spring',
  'javascript', 'typescript', 'python', 'java', 'cplusplus', 'rust', 'go', 'ruby', 'php',
  'html', 'css', 'json', 'xml', 'yaml', 'markdown', 'graphql', 'rest', 'websocket',
  'http', 'https', 'tcp', 'udp', 'dns', 'ip', 'router', 'switch', 'firewall',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'heroku', 'vercel', 'netlify',
  'git', 'github', 'gitlab', 'bitbucket', 'commit', 'branch', 'merge', 'rebase', 'pull',
  'test', 'unit', 'integration', 'e2e', 'jest', 'mocha', 'cypress', 'selenium',
  'debug', 'log', 'error', 'warning', 'info', 'trace', 'console', 'monitor',
  
  // Science & Nature
  'physics', 'chemistry', 'biology', 'mathematics', 'astronomy', 'geology', 'zoology',
  'plant', 'animal', 'human', 'dna', 'rna', 'protein', 'cell', 'tissue', 'organ',
  'planet', 'star', 'galaxy', 'universe', 'asteroid', 'comet', 'moon', 'sun',
  'energy', 'matter', 'force', 'motion', 'velocity', 'acceleration', 'gravity',
  'temperature', 'pressure', 'volume', 'density', 'mass', 'weight', 'length',
  
  // Business & Finance  
  'business', 'company', 'corporation', 'enterprise', 'startup', 'incubator', 'accelerator',
  'investment', 'funding', 'venture', 'capital', 'stock', 'bond', 'market', 'trade',
  'finance', 'accounting', 'budget', 'revenue', 'profit', 'loss', 'debt', 'equity',
  'management', 'leadership', 'strategy', 'planning', 'marketing', 'sales', 'customer',
  'product', 'service', 'brand', 'quality', 'innovation', 'disruption', 'scalability',
  
  // Education & Learning
  'education', 'learning', 'teaching', 'training', 'study', 'research', 'knowledge', 'wisdom',
  'university', 'college', 'school', 'course', 'lesson', 'lecture', 'seminar', 'workshop',
  'student', 'teacher', 'professor', 'mentor', 'coach', 'tutor', ' guide', 'expert',
  'book', 'article', 'paper', 'thesis', 'dissertation', 'journal', 'publication', 'reference',
  
  // Health & Medicine
  'health', 'medicine', 'hospital', 'clinic', 'doctor', 'nurse', 'patient', 'treatment',
  'diagnosis', 'therapy', 'surgery', 'pharmacy', 'drug', 'vaccine', 'antibiotic',
  'disease', 'illness', 'symptom', 'syndrome', 'condition', 'infection', 'virus', 'bacteria',
  'exercise', 'nutrition', 'diet', 'sleep', 'stress', 'wellness', 'prevention', 'care',
  
  // Arts & Culture
  'art', 'music', 'dance', 'theater', 'film', ' photography', 'painting', 'sculpture',
  'literature', 'poetry', 'novel', 'story', 'drama', 'comedy', 'tragedy', 'satire',
  'culture', 'tradition', 'heritage', 'history', 'museum', 'gallery', 'exhibition',
  'design', 'fashion', 'architecture', 'urban', 'rural', 'urban planning',
  
  // General Words
  'life', 'death', 'birth', 'love', 'hate', 'fear', 'hope', 'dream', 'goal', 'purpose',
  'time', 'space', 'matter', 'truth', 'reality', 'virtual', 'digital', 'physical',
  'world', 'global', 'local', 'national', 'international', 'regional', 'continental',
  'social', 'community', 'family', 'friend', 'love', 'relationship', 'communication',
  
  // Actions & States
  'create', 'read', 'update', 'delete', 'manage', 'develop', 'design', 'build', 'deploy',
  'test', 'debug', 'optimize', 'analyze', 'process', 'system', 'application', 'solution',
  'working', 'running', 'waiting', 'thinking', 'learning', 'growing', 'changing', 'improving',
  'successful', 'efficient', 'effective', 'productive', 'innovative', 'creative', 'collaborative',
  
  // More Tech Terms
  'nosql', 'mongodb', 'sql', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'cassandra',
  'cloud', 'serverless', 'microservice', 'monolith', 'architecture', 'pattern', 'implementation',
  'security', 'authentication', 'authorization', 'encryption', 'privacy', 'compliance',
  'performance', 'latency', 'throughput', 'scalability', 'availability', 'reliability',
  'container', 'orchestration', 'automation', 'ci/cd', 'devops', 'agile', 'scrum',
  
  // Data Terms
  'data', 'information', 'knowledge', 'insight', 'analytics', 'statistics', 'metrics',
  'big data', 'machine learning', 'ai', 'neural network', 'deep learning', 'model',
  'training', 'inference', 'prediction', 'classification', 'clustering', 'regression',
  'natural language', 'computer vision', 'robotics', 'automation', 'cognitive',
  
  // Project Management
  'project', 'task', 'milestone', 'sprint', 'backlog', 'kanban', 'scrum', 'agile',
  'planning', 'estimation', 'priority', 'deadline', 'resource', 'allocation', 'budget',
  'risk', 'issue', 'change', 'requirement', 'specification', 'documentation',
  
  // Quality & Standards
  'quality', 'standard', 'specification', 'requirement', 'validation', 'verification', 'compliance',
  'certification', 'accreditation', 'audit', 'review', 'inspection', 'testing', 'qa',
  'best practice', 'convention', 'pattern', 'principal', 'guideline', 'policy',
  
  // Network & Web
  'network', 'internet', 'web', 'browser', 'domain', 'host', 'server', 'client',
  'request', 'response', 'session', 'cookie', 'token', 'cache', 'cdn', 'proxy',
  'load balancing', 'sharding', 'replication', 'partition', 'indexing', 'querying'
];

const TAG_OPTIONS = [
  'tech', 'programming', 'science', 'business', 'education', 'health', 'art', 'music',
  'sports', 'travel', 'food', 'nature', 'news', 'politics', 'religion', 'history',
  'gaming', 'movies', 'books', 'fashion', 'fitness', 'finance', 'career', 'personal',
  'research', 'project', 'notes', 'ideas', 'plans', 'goals', 'review', 'meeting'
];

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Note.name)
    private readonly notesModel: Model<NoteDocument>,
  ) {}

  private generateTitle(): string {
    const words: string[] = [];
    const wordCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * RANDOM_WORDS.length);
      words.push(RANDOM_WORDS[randomIndex]);
    }
    
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private generateContent(): string {
    const paragraphs: string[] = [];
    const paragraphCount = Math.floor(Math.random() * 4) + 1;
    
    for (let p = 0; p < paragraphCount; p++) {
      const sentences: string[] = [];
      const sentenceCount = Math.floor(Math.random() * 6) + 3;
      
      for (let s = 0; s < sentenceCount; s++) {
        const words: string[] = [];
        const wordCount = Math.floor(Math.random() * 12) + 4;
        
        for (let w = 0; w < wordCount; w++) {
          words.push(RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)]);
        }
        
        const sentence = words.join(' ');
        sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
      }
      
      paragraphs.push(sentences.join(' '));
    }
    
    return paragraphs.join('\n\n');
  }

  private generateTags(): string[] {
    const tagCount = Math.floor(Math.random() * 4) + 1;
    const tags: string[] = [];
    
    for (let i = 0; i < tagCount; i++) {
      const randomTag = TAG_OPTIONS[Math.floor(Math.random() * TAG_OPTIONS.length)];
      if (!tags.includes(randomTag)) {
        tags.push(randomTag);
      }
    }
    
    return tags;
  }

  private generateRandomDate(): Date {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date;
  }

  async seedNotes(count: number): Promise<{ success: boolean; count: number; message: string }> {
    const notes = [];
    
    for (let i = 0; i < count; i++) {
      const note = {
        title: this.generateTitle(),
        content: this.generateContent(),
        tags: this.generateTags(),
        comments: [],
        views: Math.floor(Math.random() * 500),
        createdAt: this.generateRandomDate(),
        updatedAt: this.generateRandomDate(),
      };
      
      notes.push(note);
    }
    
    await this.notesModel.insertMany(notes);
    
    return {
      success: true,
      count,
      message: `Successfully seeded ${count} notes`,
    };
  }

  async clearAllNotes(): Promise<{ success: boolean; count: number }> {
    const result = await this.notesModel.deleteMany({});
    
    return {
      success: true,
      count: result.deletedCount,
    };
  }

  async getNoteCount(): Promise<number> {
    return this.notesModel.countDocuments();
  }
}