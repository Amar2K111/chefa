import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Image requise (base64)' },
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

    // Obtenir le modèle Gemini avec vision (gemini-1.5-flash ou gemini-1.5-pro supportent les images)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construire le prompt pour analyser la photo et générer une recette
    const prompt = `Tu es Chef AI, un expert culinaire. Analyse cette photo d'un plat et génère une recette complète et professionnelle.

Regarde attentivement la photo et identifie :
- Le type de plat (entrée, plat principal, dessert, etc.)
- Les ingrédients visibles
- La méthode de cuisson probable
- Le niveau de difficulté estimé

Génère une recette complète au format JSON avec cette structure exacte :
{
  "title": "Nom du plat",
  "description": "Description courte et appétissante",
  "category": "Plat principal" ou "Poisson" ou "Dessert",
  "difficulty": 1-5 (1=très facile, 5=très difficile),
  "time": nombre de minutes,
  "image": "emoji approprié",
  "ingredients": ["ingrédient 1", "ingrédient 2", ...],
  "calories": nombre approximatif,
  "protein": nombre de grammes de protéines
}

Important :
- Utilise un emoji approprié pour l'image
- La catégorie doit être exactement "Plat principal", "Poisson" ou "Dessert"
- Les ingrédients doivent être une liste claire et complète
- Le temps doit être réaliste
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire
`;

    // Préparer l'image pour Gemini (format base64)
    const imagePart = {
      inlineData: {
        data: image,
        mimeType: 'image/jpeg' // On assume JPEG, pourrait être amélioré pour détecter le type
      }
    };

    // Générer la réponse avec l'image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();

    // Extraire le JSON de la réponse
    let jsonText = text;
    // Si la réponse contient du markdown, extraire juste le JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    try {
      const recipe = JSON.parse(jsonText);
      
      // Valider et compléter la recette
      const validatedRecipe = {
        title: recipe.title || 'Plat délicieux',
        description: recipe.description || 'Recette générée à partir d\'une photo',
        category: recipe.category || 'Plat principal',
        difficulty: Math.min(5, Math.max(1, recipe.difficulty || 2)),
        time: recipe.time || 30,
        image: recipe.image || '🍽️',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        calories: recipe.calories || 300,
        protein: recipe.protein || 15
      };

      return NextResponse.json({ 
        recipe: validatedRecipe,
        success: true 
      });
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError);
      // Si le parsing échoue, créer une recette basique
      return NextResponse.json({
        recipe: {
          title: 'Plat délicieux',
          description: 'Recette générée à partir d\'une photo',
          category: 'Plat principal',
          difficulty: 2,
          time: 30,
          image: '🍽️',
          ingredients: [],
          calories: 300,
          protein: 15
        },
        success: true
      });
    }

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

    // Si Gemini Vision n'est pas disponible, utiliser une approche alternative
    if (error.message?.includes('vision') || error.message?.includes('image')) {
      return NextResponse.json(
        { 
          error: 'Analyse d\'image non disponible. Utilise la fonctionnalité de description textuelle.',
          fallback: true
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse de la photo', details: error.message },
      { status: 500 }
    );
  }
}

