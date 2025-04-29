import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Initialize the OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const body = await request.json();
    const { prompt, size = '1024x1024', quality = 'high' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Validate quality parameter
    const validQualities = ['low', 'medium', 'high', 'auto'];
    if (!validQualities.includes(quality)) {
      return NextResponse.json(
        {
          error: `Invalid quality value. Supported values are: ${validQualities.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Generate image using OpenAI API
    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size,
      quality,
    });

    // Check if result.data exists and has at least one item
    if (!result.data || result.data.length === 0 || !result.data[0].b64_json) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    // Get the base64 encoded image
    const image_base64 = result.data[0].b64_json;

    // Convert base64 to buffer
    const image_buffer = Buffer.from(image_base64, 'base64');

    // Create a unique filename
    const filename = `${randomUUID()}.png`;

    // Save to the results directory
    const publicDir = path.join(process.cwd(), 'public', 'results');
    const filePath = path.join(publicDir, filename);

    // Ensure the directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // Write the file
    await fs.writeFile(filePath, image_buffer);

    // Return the image URL
    return NextResponse.json({
      success: true,
      imageUrl: `/results/${filename}`,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
