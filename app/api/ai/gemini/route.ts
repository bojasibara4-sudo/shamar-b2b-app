import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { geminiService } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    // Vérification authentification
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    let result;

    switch (action) {
      case 'generateProductDescription':
        result = await geminiService.generateProductDescription(
          params.productName,
          params.category
        );
        break;
      case 'convertCurrency':
        result = await geminiService.convertCurrency(
          params.amount,
          params.from,
          params.to
        );
        break;
      case 'translate':
        result = await geminiService.translate(
          params.text,
          params.from,
          params.to
        );
        break;
      case 'assistSourcing':
        result = await geminiService.assistSourcing(
          params.product,
          params.country
        );
        break;
      case 'assistImportExport':
        result = await geminiService.assistImportExport(
          params.product,
          params.origin,
          params.destination
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

