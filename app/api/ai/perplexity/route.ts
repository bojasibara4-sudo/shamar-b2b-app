import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { perplexityService } from '@/lib/ai/perplexity';

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
      case 'generateArguments':
        result = await perplexityService.generateNegotiationArguments(params);
        break;
      case 'comparePrices':
        result = await perplexityService.comparePrices(
          params.product,
          params.chinaPrice,
          params.localPrice,
          params.currency
        );
        break;
      case 'generateObjectionResponses':
        result = await perplexityService.generateObjectionResponses(
          params.objection,
          params.context
        );
        break;
      case 'generateMessage':
        result = await perplexityService.generatePersuasiveMessage(
          params.recipient,
          params.product,
          params.context
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
    console.error('Perplexity API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

