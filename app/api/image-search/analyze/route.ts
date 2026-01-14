import { NextRequest, NextResponse } from 'next/server';
import { imageSearchService } from '@/services/imageSearch';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    const result = await imageSearchService.analyzeImage(imageFile);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json(
      { error: 'Error analyzing image' },
      { status: 500 }
    );
  }
}

