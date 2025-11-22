import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");

        // Step 1: Analyze image with Gemini 2.0 Flash to generate a prompt
        console.log("Step 1: Analyzing image with Gemini 2.0 Flash...");

        const analysisPrompt = "Analyze this image carefully and describe the main subject, their pose, clothing, facial features, colors, and the overall mood. Be detailed and specific. Output ONLY the description text.";

        const analysisResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                analysisPrompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: file.type,
                    },
                },
            ],
        });

        const generatedPrompt = analysisResponse.text;

        if (!generatedPrompt) {
            throw new Error("Failed to generate prompt from image");
        }

        console.log("Generated Prompt:", generatedPrompt);

        // Step 2: Generate 1 3D Q-version polaroid image
        console.log("Step 2: Generating 3D Q-version polaroid image...");

        const generatedImages: string[] = [];

        // Get current time for the polaroid
        const now = new Date();
        const dateTimeStr = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Create the detailed prompt for 3D Q-version polaroid style
        const imagePrompt = `请根据以下描述创作一张图片：

${generatedPrompt}

风格要求：
- 将画面中的角色转化为3D Q版风格角色公仔（chibi style 3D character）
- 人物放置于一张拍立得照片中
- 一只手持握着拍立得相纸
- 角色从照片中突破边框，呈现立体视觉效果（3D pop-out effect）

人物：
- 将照片中的人物转化为Q版3D公仔
- 保持原照片中的服装与造型
- 可爱、萌系风格

背景：
- 背景为原照片的模糊化处理
- 作为角色背景的延伸

拍立得细节：
- 底部文字：手写字体，带爱心装饰
- 底部显示时间：${dateTimeStr}
- 经典拍立得白色边框

整体风格：vibrant colors, cute, 3D render, polaroid aesthetic`;

        console.log("Generating 3D Q-version polaroid image...");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: imagePrompt,
        });

        // Extract image from response
        if (response.candidates && response.candidates[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || "image/png";
                    const base64Img = `data:${mimeType};base64,${imageData}`;
                    generatedImages.push(base64Img);
                    console.log("3D Q-version polaroid image generated successfully");
                    break;
                }
            }
        }

        if (generatedImages.length === 0) {
            throw new Error("No images were generated");
        }

        console.log(`Successfully generated ${generatedImages.length} image(s)`);

        return NextResponse.json({
            success: true,
            description: generatedPrompt,
            images: generatedImages
        });

    } catch (error: any) {
        console.error("Error generating content:", error);
        console.error("Error message:", error?.message);

        return NextResponse.json({
            error: error?.message || "Failed to process image",
            details: error?.toString()
        }, { status: 500 });
    }
}
