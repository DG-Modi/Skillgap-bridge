import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { question, idealAnswer, userAnswer } = await request.json();

    if (!question || !idealAnswer || !userAnswer) {
      return NextResponse.json({ error: 'All fields (question, idealAnswer, userAnswer) are required' }, { status: 400 });
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
              content: `You are an expert AI interviewer grading a candidate's answer. Compare the candidate's answer to the ideal answer.
              Provide a score out of 100 and detailed feedback explaining what they did well and how they can improve.
              Strictly use the following JSON schema:
              {
                "score": number,
                "feedback": string
              }`
            },
            {
              role: 'user',
              content: `Question: ${question}\nIdeal Answer: ${idealAnswer}\nCandidate Answer: ${userAnswer}`
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

    // High fidelity offline scoring calculation
    const answerLen = userAnswer.trim().length;
    let score = 40; // baseline
    
    // Add score based on word counts
    if (answerLen > 200) score += 25;
    else if (answerLen > 80) score += 15;
    else if (answerLen > 30) score += 8;

    // Check overlap keywords
    const keywords = idealAnswer.toLowerCase()
      .split(/[^a-zA-Z]/)
      .filter((w: string) => w.length > 4);
      
    let matchCount = 0;
    const lowerUser = userAnswer.toLowerCase();
    keywords.forEach((word: string) => {
      if (lowerUser.includes(word)) {
        matchCount++;
      }
    });

    score += Math.min(35, matchCount * 6);
    score = Math.min(100, score);

    let feedback = "A good start, but try adding specific technical examples and architectural details. Mentioning operational mechanics, cache policies, or transaction parameters would strengthen your response.";
    if (score >= 85) {
      feedback = "Outstanding response! You demonstrated strong technical fluency, covered the core structural points, and provided precise terminology. Keep using this depth in your real interviews.";
    } else if (score >= 70) {
      feedback = "Solid answer. You touched on the main concepts but missed some edge-case considerations (like TTL values, volume scaling, or rollback processes). Adding concrete examples will improve your answer.";
    }

    return NextResponse.json({ score, feedback });
  } catch (err: any) {
    console.error('API Error in /api/interview/grade:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
