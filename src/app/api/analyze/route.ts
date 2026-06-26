import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { resumeText, jobRole, jobDescription } = await request.json();

    if (!resumeText || !jobRole) {
      return NextResponse.json({ error: 'Resume text and job role are required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      // Connect to Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert HR and technical recruiter. Analyze the user's resume against the target job role and optional job description.
              Return a JSON object containing a skill gap analysis, interview questions, and study recommendations.
              Create exactly 5 interview questions ranging from basic to advanced/high-level difficulty. If a job description is provided, derive questions directly from the specific requirements of the job description, otherwise use the job role. The interview questions must cover different difficulties (e.g. at least one Basic, one Intermediate, and one Advanced).
              For study recommendations, specifically prioritize recommending high-quality FREE courses, free tutorial websites (e.g. freeCodeCamp, MDN Web Docs, YouTube, Khan Academy, Coursera Free Audit, W3Schools, or official documentation), and open-source materials that provide free learning resources.
              For all link fields, you must generate a valid, active, and public URL. Do NOT use fake paths or sub-URLs. If a specific tutorial or certification link is unknown, use a root domain of a popular free learning site (e.g. 'https://www.youtube.com', 'https://www.freecodecamp.org', 'https://developer.mozilla.org', 'https://www.coursera.org', etc.). For YouTube search links, use a format like: 'https://www.youtube.com/results?search_query=topic_name' where topic_name is URL-encoded. This ensures links always work!
              For certification recommendations, prioritize recommending FREE certification courses, platforms that issue free certificates/badges (e.g., freeCodeCamp certifications, AWS Educate, Salesforce Trailhead, Cognitive Class IBM, Oracle Free Cloud Training, or Coursera courses with free audit certificates), and specify 'Free' in the cost field. Always include a valid link to the certification program.
              Strictly use the following JSON schema:
              {
                "analysis": {
                  "matchPercentage": number,
                  "matchedSkills": string[],
                  "missingSkills": string[],
                  "categoryBreakdown": [
                    { "category": string, "score": number }
                  ],
                  "actionPlan": string[]
                },
                "interviewQuestions": [
                  {
                    "id": number,
                    "question": string,
                    "type": "technical" | "behavioral",
                    "difficulty": "Basic" | "Intermediate" | "Advanced",
                    "idealAnswer": string
                  }
                ],
                "recommendations": {
                  "courses": [
                    { "id": string, "title": string, "platform": string, "duration": string, "skillsAddressed": string[], "link": string }
                  ],
                  "projects": [
                    { "id": string, "title": string, "description": string, "difficulty": "Beginner" | "Intermediate" | "Advanced", "techStack": string[], "keyFeatures": string[], "link": string }
                  ],
                  "certifications": [
                    { "id": string, "title": string, "issuer": string, "cost": string, "value": string, "link": string }
                  ]
                }
              }`
            },
            {
              role: 'user',
              content: `Resume: ${resumeText}\nTarget Role: ${jobRole}\nJob Description Context: ${jobDescription || 'None provided'}`
            }
          ]
        })
      });

      if (groqResponse.ok) {
        const groqData = await groqResponse.json();
        const aiResult = JSON.parse(groqData.choices[0].message.content);
        
        try {
          if (aiResult.recommendations) {
            const recs = aiResult.recommendations;
            if (Array.isArray(recs.courses)) {
              recs.courses = recs.courses.map((c: any) => ({
                ...c,
                link: sanitizeLink(c.link || '', c.title || '', c.platform || 'Google')
              }));
            }
            if (Array.isArray(recs.projects)) {
              recs.projects = recs.projects.map((p: any) => ({
                ...p,
                link: sanitizeLink(p.link || '', p.title || '', p.techStack?.join(' ') || 'GitHub')
              }));
            }
            if (Array.isArray(recs.certifications)) {
              recs.certifications = recs.certifications.map((cert: any) => ({
                ...cert,
                link: sanitizeLink(cert.link || '', cert.title || '', cert.issuer || 'Certification')
              }));
            }
          }
        } catch (sanitizeErr) {
          console.error('Error sanitizing recommendation links:', sanitizeErr);
        }

        return NextResponse.json(aiResult);
      } else {
        console.warn('Groq API responded with error status:', groqResponse.status);
      }
    }

    // High fidelity Fallback Mock Data based on role inputs
    console.log('Serving dynamic high-fidelity fallback mock data for:', jobRole);

    const roleClean = jobRole.trim();
    const roleLower = roleClean.toLowerCase();

    const roleWords = roleClean.split(/\s+/).filter((w: string | any[]) => w.length > 3);
    const primaryKeyword = roleWords[0] || 'Professional';
    const secondaryKeyword = roleWords[1] || 'Practice';

    // Default general fallbacks
    let matchedSkills = ['Communication', 'Time Management', 'Collaboration', 'Problem Solving', 'Project Organization'];
    let missingSkills = ['Advanced Analytics', 'Budget Optimization', 'Strategy Development', 'Client Relationship Management'];
    let breakdown = [
      { category: `${primaryKeyword} Fundamentals`, score: 70 },
      { category: `${secondaryKeyword} Operations` === `${primaryKeyword} Operations` ? 'Operational Execution' : `${secondaryKeyword} Operations`, score: 65 },
      { category: 'Strategic Planning', score: 50 },
      { category: 'Digital Tools & Tech', score: 45 }
    ];
    let actionPlan = [
      `Obtain professional credentials or certification in ${roleClean} concepts.`,
      `Design and execute a trial project focusing on closing gaps in ${missingSkills[0]} and ${missingSkills[1]}.`,
      `Attend advanced training sessions or webinars in modern tools for ${roleClean}.`
    ];

    // Customize based on common domains
    if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('ui') || roleLower.includes('web') || roleLower.includes('developer') || roleLower.includes('engineer') || roleLower.includes('software') || roleLower.includes('coding') || roleLower.includes('dev')) {
      matchedSkills = ['Git', 'TypeScript', 'Jest', 'Agile Methodologies', 'JavaScript', 'HTML5 & CSS3'];
      missingSkills = ['Kubernetes & Docker', 'AWS Cloud Services', 'GraphQL APIs', 'Redis Caching', 'System Design (Microservices)'];
      breakdown = [
        { category: 'Core Development', score: 85 },
        { category: 'System Architecture', score: 55 },
        { category: 'DevOps & Deployment', score: 40 },
        { category: 'Testing & Quality', score: 70 }
      ];
      actionPlan = [
        'Learn containerization using Docker and orchestration with Kubernetes.',
        'Study system design principles, focusing on microservices caching using Redis.',
        'Build a cloud-native project deployed on AWS using GitHub Actions for CI/CD.'
      ];
    } else if (roleLower.includes('market') || roleLower.includes('sale') || roleLower.includes('brand') || roleLower.includes('seo') || roleLower.includes('growth')) {
      matchedSkills = ['Content Strategy', 'Social Media Management', 'Copywriting', 'Public Relations', 'Google Analytics'];
      missingSkills = ['Search Engine Optimization (SEO) Audit', 'Paid Ads Campaign Management', 'SQL for Data Analysis', 'A/B Testing Methodologies', 'CRM Automation'];
      breakdown = [
        { category: 'Campaign Management', score: 80 },
        { category: 'Data Analysis', score: 50 },
        { category: 'Content & Branding', score: 85 },
        { category: 'Marketing Tech (MarTech)', score: 40 }
      ];
      actionPlan = [
        'Complete Google Ads certification and manage a test budget campaign.',
        'Learn basic SQL queries to extract campaign data directly from database tables.',
        'Set up automated email drip campaigns using HubSpot or Marketo.'
      ];
    } else if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('science') || roleLower.includes('ml') || roleLower.includes('ai')) {
      matchedSkills = ['Python Programming', 'SQL Queries', 'Data Visualization', 'Pandas & NumPy', 'Excel'];
      missingSkills = ['Machine Learning Pipelines', 'Big Data Stack (Spark/Hadoop)', 'Model Deployment (APIs)', 'Statistical Hypothesis Testing', 'Data Warehousing (Snowflake)'];
      breakdown = [
        { category: 'Statistical Analysis', score: 75 },
        { category: 'Programming & Data Prep', score: 85 },
        { category: 'Machine Learning', score: 40 },
        { category: 'Data Infrastructure', score: 50 }
      ];
      actionPlan = [
        'Build and deploy a machine learning model as a REST API using FastAPI.',
        'Complete a training course on big data processing with Apache Spark.',
        'Implement automated data pipelines using Apache Airflow and Snowflake.'
      ];
    } else if (roleLower.includes('hr') || roleLower.includes('human') || roleLower.includes('recruit') || roleLower.includes('talent')) {
      matchedSkills = ['Interpersonal Communication', 'Applicant Tracking Systems', 'Sourcing Techniques', 'Onboarding Procedures'];
      missingSkills = ['Compensation & Benefits Analysis', 'HR Policy Compliance', 'Employee Relations Mediation', 'Talent Analytics', 'Diversity & Inclusion Strategy'];
      breakdown = [
        { category: 'Sourcing & Recruitment', score: 90 },
        { category: 'HR Operations', score: 65 },
        { category: 'Employee Relations', score: 50 },
        { category: 'Strategic HR Analytics', score: 40 }
      ];
      actionPlan = [
        'Analyze company attrition trends using data analytics software.',
        'Obtain a SHRM (Society for Human Resource Management) certification.',
        'Develop a structured Diversity, Equity, and Inclusion (DEI) program template.'
      ];
    } else if (roleLower.includes('finance') || roleLower.includes('account') || roleLower.includes('audit') || roleLower.includes('tax')) {
      matchedSkills = ['Financial Reporting', 'Excel Spreadsheets', 'General Ledger', 'Accounts Payable/Receivable'];
      missingSkills = ['Financial Modeling & Forecasting', 'Tax Compliance & Strategy', 'Corporate Finance Management', 'Internal Auditing', 'ERP Systems (SAP/Oracle)'];
      breakdown = [
        { category: 'Accounting Foundations', score: 85 },
        { category: 'Forecasting & Strategy', score: 45 },
        { category: 'Compliance & Audit', score: 60 },
        { category: 'ERP & Systems', score: 50 }
      ];
      actionPlan = [
        'Build a comprehensive corporate financial model forecasting 3-year statements.',
        'Attend workshops on current tax compliance guidelines and regulatory codes.',
        'Gain certification in SAP Financial Accounting modules.'
      ];
    } else if (roleLower.includes('design') || roleLower.includes('ux') || roleLower.includes('ui') || roleLower.includes('graphic') || roleLower.includes('product')) {
      matchedSkills = ['Figma', 'Adobe Creative Suite', 'Wireframing', 'Color Theory', 'Typography'];
      missingSkills = ['User Research Methods', 'Interactive Prototyping', 'Design Systems Scaling', 'Frontend Basics (HTML/CSS)', 'Usability Testing & Analytics'];
      breakdown = [
        { category: 'Visual Design', score: 90 },
        { category: 'Interaction Design', score: 60 },
        { category: 'User Research', score: 45 },
        { category: 'Cross-functional Collaboration', score: 70 }
      ];
      actionPlan = [
        'Plan and conduct usability tests with 5+ real users for a mock product.',
        'Build a scalable design system in Figma with variables, components, and auto-layout.',
        'Take an introductory HTML/CSS course to collaborate better with developers.'
      ];
    }

    const calculatedMatch = Math.round(breakdown.reduce((sum, cat) => sum + cat.score, 0) / breakdown.length);

    // Mock interview questions matching the gaps, with varying difficulties
    const interviewQuestions = [
      {
        id: 1,
        question: `What are the core foundational principles of ${roleClean}, and how do you ensure quality and consistency in your daily operations?`,
        type: 'technical' as const,
        difficulty: 'Basic' as const,
        idealAnswer: `The foundational principles of ${roleClean} rely on structured planning, strong stakeholder communication, and leveraging standard tools. Ensuring quality involves establishing checkpoints, keeping thorough documentation, and validating outputs early.`
      },
      {
        id: 2,
        question: `How would you utilize ${missingSkills[0]} to resolve an unexpected performance drop or bottleneck in your role as a ${roleClean}?`,
        type: 'technical' as const,
        difficulty: 'Intermediate' as const,
        idealAnswer: `To address bottlenecks using ${missingSkills[0]}, first gather baseline performance indicators. Then, perform a root-cause analysis, implement standard improvements (like optimizing assets or workflows), and continuously monitor metrics to verify the fix.`
      },
      {
        id: 3,
        question: `Describe a time when you had a major disagreement with a stakeholder or client regarding a ${roleClean} project strategy. How did you negotiate and align?`,
        type: 'behavioral' as const,
        difficulty: 'Intermediate' as const,
        idealAnswer: `I focused on active listening to understand their underlying concerns, compiled data-driven examples to back my recommendation, presented options with transparent trade-offs, and agreed on a collaborative trial approach with clear success metrics.`
      },
      {
        id: 4,
        question: `Explain how you would design, scale, and implement an end-to-end framework for ${missingSkills[1] || 'operations'} to support a rapid 3x workload increase.`,
        type: 'technical' as const,
        difficulty: 'Advanced' as const,
        idealAnswer: `Scaling requires automating repetitive tasks, establishing modular templates, distributing workloads across team cross-functional lines, using cloud/digital tools to manage capacity, and maintaining a fallback queue for spillover work.`
      },
      {
        id: 5,
        question: `In transitioning to a ${roleClean} role, what do you see as your biggest skill gap regarding ${missingSkills[2] || 'advanced strategies'}, and how are you proactively addressing it?`,
        type: 'behavioral' as const,
        difficulty: 'Advanced' as const,
        idealAnswer: `My biggest gap is in ${missingSkills[2] || 'advanced strategies'}. I am addressing this by studying best-practice guides, building practical sandbox projects, enrolling in certified courses, and seeking advice from senior professionals in this domain.`
      }
    ];

    // Mock recommendations matching the gaps (prioritizing free courses and websites)
    const recommendations = {
      courses: [
        {
          id: 'mock-c-1',
          title: `Free Interactive Tutorial: ${missingSkills[0]}`,
          platform: 'freeCodeCamp (Free)',
          duration: '10 hours',
          skillsAddressed: [missingSkills[0]],
          link: 'https://www.freecodecamp.org'
        },
        {
          id: 'mock-c-2',
          title: `${missingSkills[1] || 'Strategic Management'} Foundations (Free Audit)`,
          platform: 'Coursera (Free Audit) / YouTube',
          duration: '15 hours',
          skillsAddressed: [missingSkills[1] || 'Strategy'],
          link: `https://www.youtube.com/results?search_query=${encodeURIComponent((missingSkills[1] || 'Strategic Management') + ' Tutorial')}`
        }
      ],
      projects: [
        {
          id: 'mock-p-1',
          title: `${roleClean} Optimization Project`,
          description: `Create a professional portfolio-ready case study or sandbox implementation showcasing solutions for ${missingSkills[0]} and ${missingSkills[1]}.`,
          difficulty: 'Intermediate' as const,
          techStack: [matchedSkills[0], matchedSkills[1], missingSkills[0]],
          keyFeatures: ['Detailed roadmap planning', 'Metric scorecard design', 'Execution review templates'],
          link: `https://github.com/search?q=${encodeURIComponent(roleClean + ' Project')}`
        }
      ],
      certifications: [
        {
          id: 'mock-cert-1',
          title: `freeCodeCamp Full Stack Developer Certification (100% Free)`,
          issuer: 'freeCodeCamp',
          cost: 'Free',
          value: `Demonstrates verified knowledge of ${missingSkills[0]} and related execution frameworks through hands-on coding challenges.`,
          link: 'https://www.freecodecamp.org/learn'
        }
      ]
    };

    return NextResponse.json({
      analysis: {
        matchPercentage: calculatedMatch,
        matchedSkills,
        missingSkills,
        categoryBreakdown: breakdown,
        actionPlan
      },
      interviewQuestions,
      recommendations
    });
  } catch (err: any) {
    console.error('API Error in /api/analyze:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

function sanitizeLink(url: string, title: string, platform: string): string {
  const cleanPlatform = platform.toLowerCase();
  const cleanTitle = title.trim();
  const searchQueries = encodeURIComponent(cleanTitle);

  if (url.includes('search') || url.includes('results?') || url.includes('keywords=')) {
    return url;
  }

  if (cleanPlatform.includes('youtube')) {
    return `https://www.youtube.com/results?search_query=${searchQueries}`;
  }
  
  if (cleanPlatform.includes('github')) {
    return `https://github.com/search?q=${searchQueries}`;
  }

  if (cleanPlatform.includes('coursera')) {
    return `https://www.coursera.org/search?query=${searchQueries}`;
  }

  if (cleanPlatform.includes('udemy')) {
    return `https://www.udemy.com/courses/search/?q=${searchQueries}`;
  }

  if (cleanPlatform.includes('freecodecamp')) {
    return `https://www.google.com/search?q=site:freecodecamp.org+${searchQueries}`;
  }

  if (cleanPlatform.includes('mdn') || cleanPlatform.includes('mozilla')) {
    return `https://developer.mozilla.org/en-US/search?q=${searchQueries}`;
  }

  if (cleanPlatform.includes('aws') || cleanPlatform.includes('amazon')) {
    return `https://aws.amazon.com/search/?search-searchQuery=${searchQueries}`;
  }

  if (cleanPlatform.includes('oracle')) {
    return `https://www.google.com/search?q=Oracle+Free+Training+${searchQueries}`;
  }

  if (cleanPlatform.includes('salesforce') || cleanPlatform.includes('trailhead')) {
    return `https://trailhead.salesforce.com/en/search?keywords=${searchQueries}`;
  }

  if (url && (url.includes('localhost') || url.length > 30 && !url.includes('index') && !url.includes('main'))) {
    return `https://www.google.com/search?q=${encodeURIComponent(platform + ' ' + title)}`;
  }

  return url || `https://www.google.com/search?q=${encodeURIComponent(platform + ' ' + title)}`;
}

