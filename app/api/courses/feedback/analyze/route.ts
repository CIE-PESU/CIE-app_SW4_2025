import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserById } from "@/lib/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Helper to check for placeholder keys
const isPlaceholder = (key: string | undefined) => {
  if (!key) return true;
  const placeholders = [
    "your-mistral-api-key-here",
    "your-gemini-api-key-here",
    "placeholder",
    "abc",
    "123"
  ];
  return placeholders.some(p => key.toLowerCase().includes(p));
};

export async function POST(request: NextRequest) {
  console.log("[AI-SYSTEM] Starting Feedback Analysis Request")
  
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const { feedbacks, courseId, unitId } = await request.json()
    
    const feedbackText = feedbacks
      .map((f: any) => `Rating: ${f.rating}/5, Comment: ${f.comment}`)
      .join("\n")

    const prompt = `
      You are an expert academic analyst. Analyze the following student feedback for a course unit:
      
      ${feedbackText}

      Return ONLY a JSON object in this exact format:
      {
        "summary": "3-4 sentence summary of themes and overall sentiment",
        "sentiment": "Very Positive/Mostly Positive/Neutral/Mostly Negative/Very Negative",
        "insights": ["Specific Insight 1", "Specific Insight 2", "Specific Insight 3"]
      }
    `

    let analysisText = "";
    let providerUsed = "";
    let lastError: string | null = null;

    // --- 1. TRY MISTRAL ---
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!isPlaceholder(mistralKey)) {
      try {
        console.log(`[AI-SYSTEM] Trying Mistral API...`)
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${mistralKey}`
          },
          body: JSON.stringify({
            model: "mistral-large-latest",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          analysisText = data.choices[0].message.content;
          providerUsed = "Mistral";
        } else {
          const errData = await response.text();
          lastError = `Mistral error: ${response.status} - ${errData}`;
        }
      } catch (err: any) {
        lastError = `Mistral exception: ${err.message}`;
      }
    } else {
      console.log("[AI-SYSTEM] Mistral key is placeholder, skipping...")
    }

    // --- 2. TRY GEMINI FALLBACK ---
    if (!analysisText) {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!isPlaceholder(geminiKey)) {
        try {
          console.log(`[AI-SYSTEM] Falling back to Gemini...`)
          const genAI = new GoogleGenerativeAI(geminiKey as string);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          analysisText = response.text();
          providerUsed = "Gemini";
        } catch (err: any) {
          lastError = (lastError ? lastError + " | " : "") + `Gemini exception: ${err.message}`;
        }
      } else {
         console.log("[AI-SYSTEM] Gemini key is placeholder, skipping...")
      }
    }

    // --- 3. TRY MOCK FALLBACK (ONLY IN DEV) ---
    if (!analysisText && process.env.NODE_ENV === "development") {
      console.log(`[AI-SYSTEM] Using Mock Data (Development Mode)`)
      const avgRating = feedbacks.length > 0 
        ? feedbacks.reduce((acc: number, f: any) => acc + f.rating, 0) / feedbacks.length 
        : 5;
      
      const mockAnalysis = {
        summary: `Analysis of ${feedbacks.length} feedback responses shows an average rating of ${avgRating.toFixed(1)}/5. Students generally appreciate the course content, though some have suggested more practical examples in future sessions.`,
        sentiment: avgRating >= 4 ? "Mostly Positive" : (avgRating >= 3 ? "Neutral" : "Mostly Negative"),
        insights: [
          "Maintain the current depth of theoretical explanation",
          "Introduce more real-world use cases to increase engagement",
          "Ensure unit assignments are well-distributed across the schedule"
        ]
      };
      analysisText = JSON.stringify(mockAnalysis);
      providerUsed = "Mock (Development)";
    }

    if (!analysisText) {
      return NextResponse.json({ 
        error: "AI Analysis Failed", 
        details: lastError || "No valid API keys configured" 
      }, { status: 500 })
    }

    // Extract JSON
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON")
    }
    
    const analysis = JSON.parse(jsonMatch[0])
    console.log(`[AI-SYSTEM] Success using ${providerUsed}`)

    // Save Summary and Link Feedbacks
    if (courseId) {
      const normalizedUnitId = unitId === "all" ? null : unitId;
      
      await prisma.$transaction(async (tx) => {
        // Delete existing summaries for this exact context to "overwrite"
        await tx.aISummary.deleteMany({
          where: {
            course_id: courseId,
            unit_id: normalizedUnitId
          }
        });

        const feedbackIds = feedbacks.map((f: any) => f.id).filter(Boolean);

        await tx.aISummary.create({
          data: {
            course_id: courseId,
            unit_id: normalizedUnitId,
            summary: analysis.summary,
            sentiment: analysis.sentiment,
            insights: analysis.insights,
            feedbacks: {
              connect: feedbackIds.map((id: string) => ({ id }))
            }
          }
        });
      });
    }

    return NextResponse.json({ analysis, provider: providerUsed })

  } catch (error: any) {
    console.error("[AI-SYSTEM] Root Error:", error)
    return NextResponse.json({ 
      error: "AI Analysis Failed", 
      details: error.message 
    }, { status: 500 })
  }
}
