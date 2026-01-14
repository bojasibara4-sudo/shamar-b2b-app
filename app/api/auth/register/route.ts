import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;

    // Validation basique
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérification correspondance des mots de passe
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    // Tentative d'inscription avec Supabase si disponible
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      try {
        // Créer l'utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError || !authData.user) {
          return NextResponse.json(
            { error: authError?.message || 'Erreur lors de l\'inscription' },
            { status: 400 }
          );
        }

        // Créer le profil dans la table users avec rôle buyer par défaut
        if (!authData.user) {
          return NextResponse.json(
            { error: 'Erreur lors de la création de l\'utilisateur' },
            { status: 500 }
          );
        }
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email || email,
            role: 'buyer', // Rôle par défaut
          });

        if (profileError) {
          // Si erreur lors de la création du profil, essayer de supprimer l'utilisateur auth
          console.error('Error creating user profile:', profileError);
          return NextResponse.json(
            { error: 'Erreur lors de la création du profil' },
            { status: 500 }
          );
        }

        // Définir le cookie utilisateur (source de vérité)
        // Note: Si email confirmation est requise, authData.session peut être null
        // Dans ce cas, l'utilisateur devra se connecter après confirmation
        if (authData.session && authData.user) {
          const cookieStore = await cookies();
          const userToken = Buffer.from(JSON.stringify({ 
            id: authData.user.id, 
            email: authData.user.email || email, 
            role: 'buyer' 
          })).toString('base64');
          
          cookieStore.set('shamar_user', userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            path: '/',
          });
        }

        return NextResponse.json({
          success: true,
          user: {
            id: authData.user.id,
            email: authData.user.email || email,
            role: 'buyer',
          },
        });
      } catch (supabaseError) {
        console.error('Supabase registration error:', supabaseError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'inscription' },
          { status: 500 }
        );
      }
    }

    // Fallback si Supabase n'est pas configuré
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}

