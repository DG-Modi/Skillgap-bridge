import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Resume text and job description are required' }, { status: 400 });
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
              content: `You are an expert HR and technical recruiter. Analyze the user's resume against the provided job description.
              Extract the target job role/title from the job description and return it in the JSON response as "jobRole" (e.g., "Frontend Developer", "Data Scientist", "Project Manager").
              Return a JSON object containing a skill gap analysis, interview questions, and study recommendations.
              Create exactly 5 interview questions ranging from basic to advanced/high-level difficulty derived directly from the specific requirements of the job description. The interview questions must cover different difficulties (e.g. at least one Basic, one Intermediate, and one Advanced).
              For study recommendations, specifically prioritize recommending high-quality FREE courses, free tutorial websites (e.g. freeCodeCamp, MDN Web Docs, YouTube, Khan Academy, Coursera Free Audit, W3Schools, or official documentation), and open-source materials that provide free learning resources.
              For all link fields, you must generate a valid, active, and public URL. Do NOT use fake paths or sub-URLs. If a specific tutorial or certification link is unknown, use a root domain of a popular free learning site (e.g. 'https://www.youtube.com', 'https://www.freecodecamp.org', 'https://developer.mozilla.org', 'https://www.coursera.org', etc.). For YouTube search links, use a format like: 'https://www.youtube.com/results?search_query=topic_name' where topic_name is URL-encoded. This ensures links always work!
              For certification recommendations, prioritize recommending FREE certification courses, platforms that issue free certificates/badges (e.g., freeCodeCamp certifications, AWS Educate, Salesforce Trailhead, Cognitive Class IBM, Oracle Free Cloud Training, or Coursera courses with free audit certificates), and specify 'Free' in the cost field. Always include a valid link to the certification program.
              Strictly use the following JSON schema:
              {
                "analysis": {
                  "jobRole": string,
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
              content: `Resume: ${resumeText}\nJob Description: ${jobDescription}`
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

        // Save into MySQL
        try {
          const matchScore = aiResult.analysis?.matchPercentage ?? 0;
          const matchedSkillsStr = Array.isArray(aiResult.analysis?.matchedSkills)
            ? aiResult.analysis.matchedSkills.join(', ')
            : '';
          const indiaTime = new Date(
            new Date().toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
            })
          );
          await prisma.analysisDataset.create({
            data: {
              createdAt: indiaTime,
              resumeSummary: matchedSkillsStr,
              jobDescription: jobDescription,
              matchScore: typeof matchScore === 'number' ? matchScore : parseInt(matchScore) || 0,
            },
          });
        } catch (dbErr) {
          console.error('Error saving to MySQL in AI path:', dbErr);
        }

        return NextResponse.json(aiResult);
      } else {
        console.warn('Groq API responded with error status:', groqResponse.status);
      }
    }

    // Heuristic to extract a clean job title from the first line or beginning of the job description
    const getInferredJobRole = (jd: string): string => {
      const firstLine = jd.split('\n')[0].trim();
      if (firstLine.length > 3 && firstLine.length < 60) {
        return firstLine.replace(/[^a-zA-Z0-9\s\-\#\.\+]/g, '').trim();
      }
      const words = firstLine.split(/\s+/).slice(0, 5).join(' ');
      return words.replace(/[^a-zA-Z0-9\s\-\#\.\+]/g, '').trim() || 'Software Engineer';
    };

    const inferredJobRole = getInferredJobRole(jobDescription);
    console.log('Serving dynamic high-fidelity fallback mock data for inferred role:', inferredJobRole);

    const roleClean = inferredJobRole;
    const roleLower = roleClean.toLowerCase();

    const roleWords = roleClean.split(/\s+/).filter((w: string | any[]) => w.length > 3);
    const primaryKeyword = roleWords[0] || 'Professional';
    const secondaryKeyword = roleWords[1] || 'Practice';

    // 1. Curate skills and words dynamically from inputs
    const jdSkills = getSkillsFromText(jobDescription);
    const resumeSkills = getSkillsFromText(resumeText);

    let baseMatchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
    let baseMissingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));

    // 2. Supplement with unique professional keywords/nouns from texts to ensure a rich list of 5-6 skills
    const getCleanWords = (text: string) => {
      return text.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !STOP_WORDS.has(w));
    };

    const jdWords = Array.from(new Set(getCleanWords(jobDescription)));
    const resumeWords = getCleanWords(resumeText);

    const capitalize = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
    const formatSkillName = (s: string) => s.split(' ').map(capitalize).join(' ');

    const matchedWords = jdWords.filter(word => resumeWords.includes(word)).map(capitalize);
    const missingWords = jdWords.filter(word => !resumeWords.includes(word)).map(capitalize);

    let matchedSkills = Array.from(new Set([
      ...baseMatchedSkills.map(formatSkillName),
      ...matchedWords
    ])).slice(0, 6);

    let missingSkills = Array.from(new Set([
      ...baseMissingSkills.map(formatSkillName),
      ...missingWords
    ])).slice(0, 6);

    // Fallback safety values if empty
    if (matchedSkills.length === 0) {
      matchedSkills = ['Communication', 'Documentation', 'Collaboration'];
    }
    if (missingSkills.length === 0) {
      missingSkills = ['Specialized Tools', 'Process Optimization', 'Advanced Methodologies'];
    }

    // Calculate a dynamic real-time score based on Jaccard similarity of input texts
    const similarity = calculateJaccardSimilarity(resumeText, jobDescription);
    // Map Jaccard similarity to a score between 35% and 95%
    let calculatedMatch = Math.round(calculateJaccardSimilarity(resumeText, jobDescription) * 220);
    if (jdSkills.length > 0) {
      calculatedMatch = Math.round((baseMatchedSkills.length / jdSkills.length) * 100);
    }
    calculatedMatch = Math.max(35, Math.min(calculatedMatch, 95));

    let breakdown = [
      { category: `${primaryKeyword} Core Competencies`, score: Math.min(95, calculatedMatch + 8) },
      { category: `${secondaryKeyword} Operations` === `${primaryKeyword} Operations` ? 'Operational Execution' : `${secondaryKeyword} Operations`, score: Math.min(95, calculatedMatch + 3) },
      { category: 'Role Alignment', score: Math.max(30, calculatedMatch - 12) },
      { category: 'Required Tools & Skills', score: Math.max(30, calculatedMatch - 5) }
    ];

    let actionPlan = [
      `Obtain professional credentials or certification in ${roleClean} concepts.`,
      `Design and execute a trial project focusing on closing gaps in ${missingSkills[0]} and ${missingSkills[1]}.`,
      `Attend advanced training sessions or webinars in modern tools for ${roleClean}.`
    ];

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
        question: `Describe a time when you had a major disagreement regarding a ${roleClean} project strategy. How did you negotiate and align?`,
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
          platform: 'freeCodeCamp (Free) / YouTube',
          duration: '10 hours',
          skillsAddressed: [missingSkills[0]],
          link: `https://www.youtube.com/results?search_query=${encodeURIComponent(missingSkills[0] + ' Tutorial')}`
        },
        {
          id: 'mock-c-2',
          title: `${missingSkills[1] || 'Strategic Management'} Foundations`,
          platform: 'Coursera (Free Audit) / YouTube',
          duration: '15 hours',
          skillsAddressed: [missingSkills[1] || 'Strategy'],
          link: `https://www.youtube.com/results?search_query=${encodeURIComponent((missingSkills[1] || 'Strategic Management') + ' Tutorial')}`
        }
      ],
      projects: [
        {
          id: 'mock-p-1',
          title: `${roleClean} Practical Case Study`,
          description: `Create a professional portfolio-ready case study or sandbox implementation showcasing solutions for ${missingSkills[0]} and ${missingSkills[1]}.`,
          difficulty: 'Intermediate' as const,
          techStack: [matchedSkills[0] || 'Core', matchedSkills[1] || 'Process', missingSkills[0]],
          keyFeatures: ['Detailed roadmap planning', 'Metric scorecard design', 'Execution review templates'],
          link: `https://github.com/search?q=${encodeURIComponent(roleClean + ' Project')}`
        }
      ],
      certifications: [
        {
          id: 'mock-cert-1',
          title: `${roleClean} Advanced Professional Certification`,
          issuer: 'Industry Association',
          cost: 'Free Audit Available',
          value: `Demonstrates verified knowledge of ${missingSkills[0]} and related execution frameworks.`,
          link: `https://www.google.com/search?q=${encodeURIComponent(roleClean + ' Certification')}`
        }
      ]
    };

    // Save into MySQL
    try {
      const indiaTime = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );
      await prisma.analysisDataset.create({
        data: {
          createdAt: indiaTime,
          resumeSummary: matchedSkills.join(', '),
          jobDescription: jobDescription,
          matchScore: calculatedMatch,
        },
      });
    } catch (dbErr) {
      console.error('Error saving to MySQL in fallback path:', dbErr);
    }

    return NextResponse.json({
      analysis: {
        jobRole: inferredJobRole,
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

// Curated skills dictionary for local analysis
const SKILLS_DATABASE = [
  'javascript', 'typescript', 'python', 'java', 'kotlin', 'swift', 'go', 'golang', 'rust', 'c++', 'c#', 'php', 'ruby', 'sql', 'html', 'css',
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring boot', 'spring', 'laravel', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'tailwind', 'bootstrap',
  'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'cassandra', 'elasticsearch', 'sqlite', 'mariadb', 'dynamodb',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd', 'terraform', 'ansible',
  'agile', 'scrum', 'system design', 'microservices', 'graphql', 'rest api', 'restful', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science', 'ai', 'artificial intelligence', 'data analysis', 'big data', 'spark', 'hadoop', 'ui/ux', 'seo', 'marketing', 'sales', 'hr', 'recruiting', 'finance', 'accounting', 'project management',
  'communication', 'leadership', 'problem solving', 'teamwork', 'analytical', 'time management', 'collaboration'
];

// Curated stop words list
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

function getSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILLS_DATABASE.filter(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lower);
  });
}

function calculateJaccardSimilarity(textA: string, textB: string): number {
  const getCleanWords = (text: string) => {
    return new Set(
      text.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    );
  };
  const setA = getCleanWords(textA);
  const setB = getCleanWords(textB);
  if (setA.size === 0 || setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Trigger redeployment on Netlify


