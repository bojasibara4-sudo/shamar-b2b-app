import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Mock user database (fallback si Supabase n'est pas configuré)
const mockUsers = [
  { id: '1', email: 'admin@shamar.com', password: 'admin123', role: 'admin' as const },
  { id: '2', email: 'seller@shamar.com', password: 'seller123', role: 'seller' as const },
  { id: '3', email: 'buyer@shamar.com', password: 'buyer123', role: 'buyer' as const },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    let user: { id: string; email: string; role: 'admin' | 'seller' | 'buyer' } | null = null;

    // Tentative de connexion avec Supabase (source de vérité)
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !authData.user) {
          return NextResponse.json(
            { error: 'Email ou mot de passe incorrect' },
            { status: 401 }
          );
        }

        // Récupération du profil utilisateur depuis la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', authData.user.id)
          .single();

        if (userError || !userData) {
          // Si l'utilisateur n'existe pas dans la table users, on crée un profil par défaut
          if (!authData.user) {
            return NextResponse.json(
              { error: 'Erreur lors de la récupération de l\'utilisateur' },
              { status: 500 }
            );
          }
          user = {
            id: authData.user.id,
            email: authData.user.email || email,
            role: 'buyer', // Rôle par défaut
          };
        } else {
          user = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
          };
        }

        // Stockage des infos utilisateur dans un cookie HTTP-only (source de vérité)
        const cookieStore = await cookies();
        const userToken = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');
        cookieStore.set('shamar_user', userToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 jours
          path: '/',
        });
      } catch (supabaseError) {
        console.error('Supabase authentication error:', supabaseError);
        return NextResponse.json(
          { error: 'Erreur d\'authentification. Veuillez réessayer.' },
          { status: 500 }
        );
      }
    } else {
      // Supabase non configuré - erreur
      return NextResponse.json(
        { error: 'Configuration d\'authentification manquante' },
        { status: 500 }
      );
    }

    // Vérifier que l'utilisateur a été créé
    if (!user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}

