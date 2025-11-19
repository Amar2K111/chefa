import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

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

    // Obtenir le modèle Gemini 2.0 avec vision
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Construire le prompt pour analyser la photo et générer une recette
    const prompt = `Tu es Chefa, un chef expert culinaire qui s'inspire des plus grands chefs de l'histoire : Auguste Escoffier (père de la cuisine moderne française), Marie-Antoine Carême (pionnier de la grande cuisine), Julia Child (maître de la cuisine française pour tous), Paul Bocuse (ambassadeur de la nouvelle cuisine), Ferran Adrià (pionnier de la gastronomie moléculaire), Alain Ducasse (excellence contemporaine), et Gordon Ramsay (maître des techniques modernes).

Tu combines leur savoir-faire, leurs techniques éprouvées et leur passion pour créer des recettes exceptionnelles. Analyse cette photo d'un plat et génère une recette complète et professionnelle.

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
  "image": "chefa",
  "ingredients": ["ingrédient 1", "ingrédient 2", ...],
  "calories": nombre approximatif,
  "protein": nombre de grammes de protéines,
  "steps": [
    {
      "step": 1,
      "title": "Titre de l'étape",
      "description": "Description détaillée de l'étape",
      "time": nombre de minutes pour cette étape,
      "tip": "Conseil ou astuce pour cette étape"
    },
    ...
  ]
}

IMPORTANT pour les steps :
- Génère 4 à 8 étapes de cuisson détaillées et spécifiques à ce plat visible sur la photo
- Chaque étape doit être claire et actionnable
- Le temps total des étapes doit correspondre au temps total de la recette
- Ajoute des conseils pratiques pour chaque étape

Important :
- Utilise "chefa" pour l'image (l'image de la mascotte sera affichée)
- La catégorie doit être exactement "Plat principal", "Poisson" ou "Dessert"
- Les ingrédients doivent être une liste claire et complète
- Le temps doit être réaliste
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire
`;

    // Préparer l'image pour Gemini (format base64)
    // Valider le type MIME (Gemini accepte image/jpeg, image/png, image/webp, image/gif)
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const imageMimeType = mimeType && validMimeTypes.includes(mimeType) 
      ? mimeType 
      : 'image/jpeg'; // Fallback vers JPEG par défaut

    const imagePart = {
      inlineData: {
        data: image,
        mimeType: imageMimeType
      }
    };

    // Générer la réponse avec l'image
    // Pour Gemini 1.5, on passe l'image comme Part dans le tableau
    let result;
    try {
      // Essayer avec la syntaxe standard
      result = await model.generateContent([
        { text: prompt },
        { inlineData: { data: image, mimeType: imageMimeType } }
      ]);
    } catch (modelError: any) {
      console.error('Erreur lors de la génération avec image:', modelError);
      
      // Si ça échoue, essayer avec l'ancienne syntaxe
      try {
        result = await model.generateContent([prompt, imagePart]);
      } catch (retryError: any) {
        console.error('Erreur avec syntaxe alternative:', retryError);
        throw new Error(`Impossible d'analyser l'image. Vérifie que ta clé API Gemini a accès aux modèles avec vision. Erreur: ${modelError.message || retryError.message}`);
      }
    }
    
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
        image: recipe.image || 'chefa',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        calories: recipe.calories || 300,
        protein: recipe.protein || 15,
        steps: Array.isArray(recipe.steps) && recipe.steps.length > 0 
          ? recipe.steps.map((s: any, idx: number) => ({
              step: idx + 1,
              title: s.title || `Étape ${idx + 1}`,
              description: s.description || '',
              time: s.time || 5,
              tip: s.tip || ''
            }))
          : undefined
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
          image: 'chefa',
          ingredients: [],
          calories: 300,
          protein: 15
        },
        success: true
      });
    }

  } catch (error: any) {
    console.error('Erreur Gemini API:', error);
    console.error('Détails de l\'erreur:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Gérer les erreurs spécifiques
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Clé API invalide ou manquante. Vérifie ta configuration.' },
        { status: 401 }
      );
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Quota API dépassé. Réessaie plus tard.' },
        { status: 429 }
      );
    }

    // Erreurs liées au format de l'image
    if (error.message?.includes('image') || error.message?.includes('mimeType') || error.message?.includes('invalid')) {
      return NextResponse.json(
        { 
          error: 'Format d\'image non supporté. Utilise JPG, PNG ou WebP.',
          details: error.message
        },
        { status: 400 }
      );
    }

    // Erreurs liées au modèle
    if (error.message?.includes('model') || error.message?.includes('gemini') || error.message?.includes('not found') || error.message?.includes('404')) {
      return NextResponse.json(
        { 
          error: 'Le modèle d\'analyse d\'image n\'est pas disponible avec ta clé API. Vérifie que ta clé API Gemini a accès aux modèles avec vision (gemini-2.0-flash-exp).',
          details: error.message,
          suggestion: 'Tu peux utiliser la fonctionnalité "Ajouter une recette" avec description textuelle à la place.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
        { 
          error: 'Erreur lors de l\'analyse de la photo', 
          details: error.message || 'Erreur inconnue',
          suggestion: 'Vérifie que ta clé API Gemini est correctement configurée et que le modèle gemini-2.0-flash-exp est disponible.'
        },
      { status: 500 }
    );
  }
}

