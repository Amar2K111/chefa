import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    // Vérifier que la clé API est configurée
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée' },
        { status: 500 }
      );
    }

    // Obtenir le modèle Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construire le prompt contextuel pour le chef IA
    let systemPrompt = `Tu es Chef AI, un assistant culinaire expert et bienveillant. Tu aides les utilisateurs à cuisiner en leur donnant des conseils pratiques, des astuces et des réponses à leurs questions culinaires.

Ton style :
- Amical et encourageant (utilise "tu")
- Pratique et concret
- Utilise des emojis avec modération
- Réponds en français
- Sois concis mais complet

`;

    // Ajouter le contexte si disponible
    if (context) {
      if (context.recipe) {
        systemPrompt += `L'utilisateur cuisine actuellement : ${context.recipe}.\n`;
      }
      if (context.step !== undefined) {
        systemPrompt += `Il est à l'étape ${context.step + 1} de la recette.\n`;
      }
    }

    systemPrompt += `\nQuestion de l'utilisateur : ${message}\n\nRéponds de manière utile et encourageante.`;

    // Générer la réponse
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      message: text.trim(),
      success: true 
    });

  } catch (error: any) {
    console.error('Erreur Gemini API:', error);
    
    // Gérer les erreurs spécifiques
    if (error.message?.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'Clé API invalide ou manquante' },
        { status: 401 }
      );
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Quota API dépassé. Réessaie plus tard.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération de la réponse', details: error.message },
      { status: 500 }
    );
  }
}

