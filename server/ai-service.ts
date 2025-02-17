import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const TRADING_PROMPT = `Analyze this cryptocurrency trading chart and provide a detailed trading strategy. Include:
1. Identify key technical patterns (candlestick patterns, trend lines)
2. Support and resistance levels
3. Key technical indicators (if visible: RSI, MACD, EMAs)
4. Trading recommendation with:
   - Entry price
   - Stop loss level
   - Take profit target
   - Trading direction (long/short)
   - Confidence level (0-1)
5. Brief reasoning for the strategy

Format the analysis as JSON matching this TypeScript type:
{
  indicators: {
    support: number[],
    resistance: number[],
    patterns: string[],
    rsi?: number,
    macd?: { signal: number, histogram: number },
    ema?: number[]
  },
  strategy: {
    entryPrice: number,
    stopLoss: number,
    takeProfit: number,
    direction: "long" | "short",
    confidence: number,
    reasoning: string
  }
}`;

export async function analyzeChart(imageUrl: string) {
  try {
    console.log("Starting chart analysis...");

    // Validate the image data URL format
    if (!imageUrl.startsWith('data:image/')) {
      throw new Error("Invalid image data URL format");
    }

    // Convert data URL to binary
    const base64Image = imageUrl.split(',')[1];
    if (!base64Image) {
      throw new Error("Failed to extract base64 image data");
    }

    console.log("Image data extracted successfully");

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const result = await model.generateContent([
      TRADING_PROMPT,
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image
        }
      }
    ]);

    const response = result.response;
    const analysisText = response.text();
    console.log("Raw AI response:", analysisText);

    try {
      // Extract JSON from the response
      const jsonStr = analysisText.match(/\{[\s\S]*\}/)?.[0];
      if (!jsonStr) {
        throw new Error("No JSON found in response");
      }

      const analysis = JSON.parse(jsonStr);
      console.log("Parsed analysis:", analysis);

      // Validate required fields
      if (!analysis.indicators || !analysis.strategy) {
        throw new Error("Invalid analysis format: missing required fields");
      }

      return analysis;
    } catch (parseError) {
      console.error("Failed to parse AI response:", analysisText);
      throw new Error("Failed to parse trading analysis");
    }
  } catch (error) {
    console.error("AI analysis error:", error);
    throw new Error("Failed to analyze chart");
  }
}