import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { description, ingredients, instructions } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description du plat requise' },
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

    // Construire le prompt pour générer une recette complète
    let prompt = `Tu es Chef AI, un expert culinaire. L'utilisateur veut créer une recette pour : "${description}".

${ingredients ? `Ingrédients fournis : ${ingredients}` : ''}
${instructions ? `Instructions fournies : ${instructions}` : ''}

Génère une recette complète et professionnelle au format JSON avec cette structure exacte :
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
- Les ingrédients doivent être une liste claire
- Le temps doit être réaliste
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire
`;

    // Générer la réponse
    const result = await model.generateContent(prompt);
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
        title: recipe.title || description,
        description: recipe.description || `Délicieux ${description}`,
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
          title: description,
          description: `Recette personnalisée : ${description}`,
          category: 'Plat principal',
          difficulty: 2,
          time: 30,
          image: '🍽️',
          ingredients: ingredients ? ingredients.split(',').map((i: string) => i.trim()) : [],
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

    return NextResponse.json(
      { error: 'Erreur lors de la génération de la recette', details: error.message },
      { status: 500 }
    );
  }
}

