import { create } from 'zustand';

export interface SkillGapAnalysis {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  categoryBreakdown: {
    category: string;
    score: number; // 0-100
  }[];
  actionPlan: string[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  type: 'technical' | 'behavioral';
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
  idealAnswer: string;
  userAnswer?: string;
  feedback?: string;
  score?: number; // 0-100
}

export interface CourseRecommendation {
  id: string;
  title: string;
  platform: string;
  duration: string;
  skillsAddressed: string[];
  link: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  keyFeatures: string[];
  link?: string;
}

export interface CertRecommendation {
  id: string;
  title: string;
  issuer: string;
  cost: string;
  value: string;
  link?: string;
}

export interface RecommendationsData {
  courses: CourseRecommendation[];
  projects: ProjectRecommendation[];
  certifications: CertRecommendation[];
}

export interface CompareRoleFit {
  roleName: string;
  matchPercentage: number;
  matchedCount: number;
  missingCount: number;
  missingSkills: string[];
}

interface AppState {
  resumeText: string;
  resumeFileName: string;
  targetRole: string;
  isAnalyzing: boolean;
  analysisResult: SkillGapAnalysis | null;
  interviewQuestions: InterviewQuestion[];
  isGeneratingInterview: boolean;
  recommendations: RecommendationsData | null;
  isGeneratingRecommendations: boolean;
  compareFits: CompareRoleFit[];
  
  // Actions
  setResume: (text: string, fileName: string) => void;
  setTargetRole: (role: string) => void;
  setAnalyzing: (status: boolean) => void;
  setAnalysisResult: (result: SkillGapAnalysis) => void;
  setInterviewQuestions: (questions: InterviewQuestion[]) => void;
  updateUserAnswer: (questionId: number, answer: string) => void;
  updateQuestionFeedback: (questionId: number, feedback: string, score: number) => void;
  setInterviewGenerating: (status: boolean) => void;
  setRecommendations: (recs: RecommendationsData) => void;
  setRecommendationsGenerating: (status: boolean) => void;
  resetAll: () => void;
  loadMockData: () => void;
}

// Initial placeholder mock data
export const sampleResumeText = `Jane Doe
Senior Frontend Engineer
Email: jane.doe@example.com | Phone: (555) 019-2834 | San Francisco, CA

Professional Summary:
Passion&nbsp;ate Frontend Engineer with 5+ years of experience building scalable, high-performance web applications using React, Next.js, and TypeScript. Expert in responsive design, CSS architecture, state management, and modern CI/CD workflows.

Skills:
- Frontend: HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), TypeScript, React, Next.js, Redux, Zustand
- Tooling: Webpack, Vite, Git, GitHub Actions, Jest, React Testing Library, ESLint, Prettier
- Design: Figma, Responsive UI, Web Accessibility (a11y)

Experience:
- Frontend Engineer, TechFlow Solutions (2023 - Present): Led migration of legacy core product to Next.js, resulting in 40% improvement in load times. Built reusable component library.
- Software Developer, WebCraft Ventures (2021 - 2023): Designed and developed interactive dashboard reporting systems. Automated test suites to increase coverage to 85%.`;

export const sampleAnalysisResult: SkillGapAnalysis = {
  matchPercentage: 74,
  matchedSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Git', 'Jest', 'Responsive UI', 'Figma'],
  missingSkills: ['PostgreSQL', 'GraphQL API', 'Node.js/Express', 'Docker Containerization', 'Redis Caching', 'System Design (Microservices)'],
  categoryBreakdown: [
    { category: 'Frontend Development', score: 95 },
    { category: 'Backend Integration', score: 60 },
    { category: 'Database & Storage', score: 45 },
    { category: 'DevOps & Tooling', score: 70 },
    { category: 'System Architecture', score: 50 },
  ],
  actionPlan: [
    'Gain foundational knowledge of PostgreSQL database indexing and query optimization.',
    'Build a microservice using Node.js/Express and integrate GraphQL queries.',
    'Containerize frontend and backend applications using Docker.',
    'Implement Redis to cache frequent database queries and decrease response latency.',
  ]
};

export const sampleInterviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: "Explain the difference between SQL and NoSQL databases, and why PostgreSQL might be selected over MongoDB for an enterprise financial transaction log.",
    type: "technical",
    difficulty: "Intermediate",
    idealAnswer: "SQL databases like PostgreSQL are relational and support ACID transactions, making them ideal for financial logs requiring high consistency. MongoDB is NoSQL, document-oriented, and optimized for unstructured data and horizontal scaling, but lacks strong relation constraints by default.",
    userAnswer: "",
    feedback: "",
    score: 0
  },
  {
    id: 2,
    question: "How would you design a caching strategy using Redis for a heavy read-only dashboard that aggregates user skills analysis statistics?",
    type: "technical",
    difficulty: "Advanced",
    idealAnswer: "Use a Cache-Aside pattern. When the dashboard requests data, check Redis. If a hit occurs, return it. If a miss occurs, fetch from PostgreSQL, write to Redis with a TTL (e.g., 1 hour), and return. Invalidate or update the cache when a new skill analysis is run.",
    userAnswer: "",
    feedback: "",
    score: 0
  },
  {
    id: 3,
    question: "Explain what GraphQL resolver queries are, and how you prevent the N+1 database querying problem in a Node.js API server.",
    type: "technical",
    difficulty: "Advanced",
    idealAnswer: "A resolver returns the data for a GraphQL field. The N+1 problem occurs when a query fetches a list of items (1 query) and then makes a separate database query for a relation on each item (N queries). Use DataLoader in Node.js to batch and cache the relation requests into a single SQL command.",
    userAnswer: "",
    feedback: "",
    score: 0
  },
  {
    id: 4,
    question: "Describe a situation where you had to quickly adopt a backend or DevOps technology (like Docker) that you had no prior experience with. What was your approach?",
    type: "behavioral",
    difficulty: "Basic",
    idealAnswer: "The candidate should describe setting up a structured learning path (docs, simple tutorials), building a sandbox/pet project, collaborating with team experts, and systematically debugging configuration errors until successfully deploying a containerized app.",
    userAnswer: "",
    feedback: "",
    score: 0
  },
  {
    id: 5,
    question: "Explain how you would scale a standard Node.js Express application to handle thousands of requests per second.",
    type: "technical",
    difficulty: "Advanced",
    idealAnswer: "Use Node cluster module to utilize multi-core CPUs, implement horizontal scaling with a load balancer (like Nginx or AWS ALB), offload intensive processes to background message queues (RabbitMQ/BullMQ), configure Redis caching, and optimize PostgreSQL indexes.",
    userAnswer: "",
    feedback: "",
    score: 0
  }
];

export const sampleRecommendations: RecommendationsData = {
  courses: [
    {
      id: "course-1",
      title: "SQL and PostgreSQL Tutorial for Beginners (Free)",
      platform: "freeCodeCamp (Free)",
      duration: "4 hours",
      skillsAddressed: ["PostgreSQL", "Database Schema Design", "SQL Queries"],
      link: "https://www.freecodecamp.org"
    },
    {
      id: "course-2",
      title: "Node.js Express Full Course (Free)",
      platform: "freeCodeCamp / YouTube (Free)",
      duration: "8 hours",
      skillsAddressed: ["Node.js/Express", "REST APIs", "GraphQL APIs"],
      link: "https://www.freecodecamp.org"
    },
    {
      id: "course-3",
      title: "Docker & Kubernetes for Beginners (Free)",
      platform: "freeCodeCamp / TechWorld with Nana (Free)",
      duration: "6 hours",
      skillsAddressed: ["Docker Containerization", "DevOps basics"],
      link: "https://www.youtube.com"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Fullstack E-Commerce Backend Service",
      description: "Build a robust Node.js and PostgreSQL e-commerce backend API supporting authentication, product catalogs, shopping carts, and order processing.",
      difficulty: "Intermediate",
      techStack: ["Node.js", "Express", "PostgreSQL", "Sequelize ORM", "Docker"],
      keyFeatures: [
        "ACID transactional safety for checkout flows",
        "Docker Compose configuration for PostgreSQL database and API service",
        "PostgreSQL indexes optimized for high-volume catalog searching"
      ],
      link: "https://github.com/topics/nodejs-postgresql-ecommerce"
    },
    {
      id: "proj-2",
      title: "Real-time Leaderboard with Redis and GraphQL",
      description: "Create an interactive user ranking dashboard using GraphQL subscriptions, Node.js, and Redis sorted sets to store real-time user scores.",
      difficulty: "Advanced",
      techStack: ["React", "GraphQL Subscriptions", "Node.js", "Redis", "Docker"],
      keyFeatures: [
        "Sub-millisecond latency scoreboard updates using Redis ZADD",
        "GraphQL resolver layer batching database requests with DataLoader",
        "Real-time UI alerts using WebSockets"
      ],
      link: "https://github.com/topics/graphql-redis-leaderboard"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Developer – Associate (Free Prep & Exam Voucher Pathways)",
      issuer: "Amazon Web Services",
      cost: "Free Prep / $150 Exam",
      value: "Highly valued for understanding cloud architecture, serverless microservices, and database hosting. Check AWS Educate for free learning pathways.",
      link: "https://aws.amazon.com/education/aws-educate/"
    },
    {
      id: "cert-2",
      title: "freeCodeCamp Full Stack Developer Certification (100% Free)",
      issuer: "freeCodeCamp",
      cost: "Free",
      value: "Provides completely free hands-on certification path for frontend, backend, databases, and microservices architecture.",
      link: "https://www.freecodecamp.org/learn"
    }
  ]
};

export const sampleCompareFits: CompareRoleFit[] = [
  {
    roleName: "Full Stack Engineer",
    matchPercentage: 74,
    matchedCount: 9,
    missingCount: 6,
    missingSkills: ['PostgreSQL', 'GraphQL API', 'Node.js/Express', 'Docker Containerization', 'Redis Caching', 'System Design (Microservices)']
  },
  {
    roleName: "Senior Frontend Engineer",
    matchPercentage: 96,
    matchedCount: 12,
    missingCount: 1,
    missingSkills: ['GraphQL API']
  },
  {
    roleName: "Backend Engineer",
    matchPercentage: 45,
    matchedCount: 4,
    missingCount: 10,
    missingSkills: ['PostgreSQL', 'GraphQL API', 'Node.js/Express', 'Docker Containerization', 'Redis Caching', 'System Design (Microservices)', 'Go/Java', 'CI/CD Pipelines', 'REST APIs', 'Unit Testing']
  },
  {
    roleName: "DevOps Engineer",
    matchPercentage: 32,
    matchedCount: 3,
    missingCount: 9,
    missingSkills: ['Docker Containerization', 'CI/CD Pipelines', 'Kubernetes', 'Terraform (IaC)', 'AWS Cloud Services', 'Linux Administration', 'Monitoring (Prometheus/Grafana)', 'Bash Scripting', 'Nginx/Load Balancers']
  }
];

export const useStore = create<AppState>((set) => ({
  resumeText: '',
  resumeFileName: '',
  targetRole: '',
  isAnalyzing: false,
  analysisResult: null,
  interviewQuestions: [],
  isGeneratingInterview: false,
  recommendations: null,
  isGeneratingRecommendations: false,
  compareFits: [],

  setResume: (text, fileName) => set({ resumeText: text, resumeFileName: fileName }),
  setTargetRole: (role) => set({ targetRole: role }),
  setAnalyzing: (status) => set({ isAnalyzing: status }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setInterviewQuestions: (questions) => set({ interviewQuestions: questions }),
  
  updateUserAnswer: (questionId, answer) => set((state) => ({
    interviewQuestions: state.interviewQuestions.map((q) =>
      q.id === questionId ? { ...q, userAnswer: answer } : q
    )
  })),
  
  updateQuestionFeedback: (questionId, feedback, score) => set((state) => ({
    interviewQuestions: state.interviewQuestions.map((q) =>
      q.id === questionId ? { ...q, feedback, score } : q
    )
  })),
  
  setInterviewGenerating: (status) => set({ isGeneratingInterview: status }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setRecommendationsGenerating: (status) => set({ isGeneratingRecommendations: status }),
  
  resetAll: () => set({
    resumeText: '',
    resumeFileName: '',
    targetRole: '',
    isAnalyzing: false,
    analysisResult: null,
    interviewQuestions: [],
    isGeneratingInterview: false,
    recommendations: null,
    isGeneratingRecommendations: false,
    compareFits: []
  }),

  loadMockData: () => set({
    resumeText: sampleResumeText,
    resumeFileName: 'Jane_Doe_Resume.pdf',
    targetRole: 'Full Stack Engineer',
    isAnalyzing: false,
    analysisResult: sampleAnalysisResult,
    interviewQuestions: sampleInterviewQuestions,
    isGeneratingInterview: false,
    recommendations: sampleRecommendations,
    isGeneratingRecommendations: false,
    compareFits: sampleCompareFits
  })
}));
