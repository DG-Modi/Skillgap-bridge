import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { resumeText, targetRole } = await request.json();

    if (!resumeText || !targetRole) {
      return NextResponse.json({ error: 'Resume and target role are required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
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
              content: `You are a Senior Technical Recruiter. Based on the candidate's resume and target job role, generate exactly 5 interview questions.
              Mix technical and behavioral questions targeted specifically at closing their skill gaps.
              Create exactly 5 interview questions ranging from basic to advanced/high-level difficulty. The interview questions must cover different difficulties (e.g. at least one Basic, one Intermediate, and one Advanced).
              Strictly use the following JSON schema:
              {
                "questions": [
                  {
                    "id": number,
                    "question": string,
                    "type": "technical" | "behavioral",
                    "difficulty": "Basic" | "Intermediate" | "Advanced",
                    "idealAnswer": string
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Candidate Resume: ${resumeText}\nTarget Role: ${targetRole}`
            }
          ]
        })
      });

      if (groqResponse.ok) {
        const groqData = await groqResponse.json();
        const result = JSON.parse(groqData.choices[0].message.content);
        return NextResponse.json(result);
      }
    }

    // Dynamic High fidelity fallback mock questions based on the target role
    console.log('Serving dynamic high-fidelity fallback interview questions for:', targetRole);
    const roleClean = targetRole.trim();
    const roleLower = roleClean.toLowerCase();

    let questions = [
      {
        id: 1,
        question: `What are the core foundational principles of ${roleClean}, and how do you ensure quality and consistency in your daily operations?`,
        type: 'technical',
        difficulty: 'Basic',
        idealAnswer: `The foundational principles of ${roleClean} rely on structured planning, strong stakeholder communication, and leveraging standard tools. Ensuring quality involves establishing checkpoints, keeping thorough documentation, and validating outputs early.`
      },
      {
        id: 2,
        question: `How would you utilize modern methodologies or tools to resolve an unexpected performance drop or bottleneck in your role as a ${roleClean}?`,
        type: 'technical',
        difficulty: 'Intermediate',
        idealAnswer: `First gather baseline performance indicators. Then, perform a root-cause analysis, implement standard improvements (like optimizing assets or workflows), and continuously monitor metrics to verify the fix.`
      },
      {
        id: 3,
        question: `Describe a time when you had a major disagreement with a stakeholder or client regarding a ${roleClean} project strategy. How did you negotiate and align?`,
        type: 'behavioral',
        difficulty: 'Intermediate',
        idealAnswer: `I focused on active listening to understand their underlying concerns, compiled data-driven examples to back my recommendation, presented options with transparent trade-offs, and agreed on a collaborative trial approach with clear success metrics.`
      },
      {
        id: 4,
        question: `Explain how you would design, scale, and implement an end-to-end framework to support a rapid 3x workload increase in a ${roleClean} context.`,
        type: 'technical',
        difficulty: 'Advanced',
        idealAnswer: `Scaling requires automating repetitive tasks, establishing modular templates, distributing workloads across team cross-functional lines, using cloud/digital tools to manage capacity, and maintaining a fallback queue for spillover work.`
      },
      {
        id: 5,
        question: `In transitioning to or advancing in a ${roleClean} position, what do you see as your biggest skill gap, and how are you proactively addressing it?`,
        type: 'behavioral',
        difficulty: 'Advanced',
        idealAnswer: `I identify my biggest gap, research best-practice guides, build practical sandbox projects, enroll in certified courses, and seek advice from senior professionals in this domain.`
      }
    ];

    if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('ui') || roleLower.includes('web') || roleLower.includes('developer') || roleLower.includes('engineer') || roleLower.includes('software')) {
      questions = [
        {
          id: 1,
          question: "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR), and which you would choose for an SEO-heavy website.",
          type: "technical",
          difficulty: "Basic",
          idealAnswer: "Client-side rendering loads a minimal HTML shell and lets JavaScript render components in the browser. Server-side rendering compiles HTML on the server for each request. For an SEO-heavy website, SSR is superior as search engine crawlers receive fully rendered HTML immediately, improving indexing and load speeds."
        },
        {
          id: 2,
          question: "How do you optimize core web vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS), in a React/Next.js application?",
          type: "technical",
          difficulty: "Intermediate",
          idealAnswer: "Optimize LCP by lazy-loading images, compressing images (e.g. Next.js Image component), using CDNs, and prioritizing critical css. Optimize CLS by setting explicit width/height on images and placeholders, avoiding dynamic content injections above existing content, and using font-display: optional."
        },
        {
          id: 3,
          question: "Describe a situation where a frontend deployment you pushed caused unexpected regressions for active users. How did you resolve it under pressure?",
          type: "behavioral",
          difficulty: "Intermediate",
          idealAnswer: "I monitored client telemetry logs, rolled back the release immediately to restore stability, reproduced the regression in the staging environment, implemented a fix and wrote regression tests, and added stricter staging validation pipelines."
        },
        {
          id: 4,
          question: "How would you design a caching strategy using Redis for database queries related to a target full-stack web application?",
          type: "technical",
          difficulty: "Advanced",
          idealAnswer: "Implement a Cache-Aside pattern. Intercept read operations: fetch from cache; if cache miss occurs, query database, store outcome back into cache with a TTL (e.g. 1 hour), and return. Invalidate or update the cache when database records are modified."
        },
        {
          id: 5,
          question: "Describe how you would scale a standard Node.js Express application to handle thousands of requests per second.",
          type: "technical",
          difficulty: "Advanced",
          idealAnswer: "Use Node cluster module to utilize multi-core CPUs, implement horizontal scaling with a load balancer, offload intensive processes to background message queues (like RabbitMQ or BullMQ), configure Redis caching, and optimize database indexes."
        }
      ];
    } else if (roleLower.includes('market') || roleLower.includes('sale') || roleLower.includes('brand') || roleLower.includes('seo') || roleLower.includes('growth')) {
      questions = [
        {
          id: 1,
          question: "What is the difference between organic search traffic (SEO) and paid search traffic (SEM), and how do they work together in a growth funnel?",
          type: "technical",
          difficulty: "Basic",
          idealAnswer: "SEO is organic and built over time through content, keywords, and domain authority. SEM is paid advertising for immediate visibility. Together, SEM can capture high-intent leads quickly while SEO builds long-term organic traffic to lower customer acquisition cost (CAC)."
        },
        {
          id: 2,
          question: "How would you design and analyze an A/B test for a marketing landing page to improve conversion rates? What metrics would you track?",
          type: "technical",
          difficulty: "Intermediate",
          idealAnswer: "Establish a clear hypothesis (e.g. changing CTA copy improves clicks). Randomly split traffic between control (A) and variant (B). Track conversion rate, bounce rate, time-on-page, and statistical significance (p-value < 0.05) to confirm if the change is genuinely effective."
        },
        {
          id: 3,
          question: "Describe a marketing campaign you managed that failed to meet its targets. What went wrong, and how did you adjust your strategy for the next launch?",
          type: "behavioral",
          difficulty: "Intermediate",
          idealAnswer: "Describe a campaign that suffered from poor audience targeting or bad timing. Explain how you reviewed the analytics, interviewed some users, re-allocated budget to high-performing channels, narrowed targeting parameters, and exceeded targets in the follow-up campaign."
        },
        {
          id: 4,
          question: "How would you build a multi-channel attribution model to accurately measure marketing ROI across social media, search, and email marketing?",
          type: "technical",
          difficulty: "Advanced",
          idealAnswer: "Move away from last-touch models to a data-driven or position-based (U-shaped) attribution model. Map user touchpoints using UTM tags, merge CRM leads with ad platform costs, and weigh early discovery (40%), mid-funnel nurtures (20%), and final conversions (40%) to calculate accurate CAC/LTV."
        },
        {
          id: 5,
          question: "Explain how you would plan and launch a market entry strategy for a B2B SaaS product with a limited budget.",
          type: "behavioral",
          difficulty: "Advanced",
          idealAnswer: "Identify a specific, underserved niche audience (ideal customer profile). Leverage outbound organic LinkedIn sourcing, content marketing, and partnerships/integrations with existing tools. Run small, highly targeted search ads to validate messaging before scaling."
        }
      ];
    }

    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error('API Error in /api/interview:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
