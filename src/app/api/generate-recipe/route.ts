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

    // Obtenir le modèle Gemini 2.0
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Construire le prompt pour générer une recette complète
    let prompt = `Tu es Chefa, un chef expert culinaire qui s'inspire des plus grands chefs de l'histoire : Auguste Escoffier (père de la cuisine moderne française), Marie-Antoine Carême (pionnier de la grande cuisine), Julia Child (maître de la cuisine française pour tous), Paul Bocuse (ambassadeur de la nouvelle cuisine), Ferran Adrià (pionnier de la gastronomie moléculaire), Alain Ducasse (excellence contemporaine), et Gordon Ramsay (maître des techniques modernes). 

Tu combines leur savoir-faire, leurs techniques éprouvées et leur passion pour créer des recettes exceptionnelles. L'utilisateur veut créer une recette pour : "${description}".

${ingredients ? `Ingrédients fournis : ${ingredients}` : ''}
${instructions ? `Instructions fournies : ${instructions}` : ''}

Génère une recette complète et professionnelle au format JSON avec cette structure exacte :
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
- Génère 4 à 8 étapes de cuisson détaillées et spécifiques à cette recette
- Chaque étape doit être claire et actionnable
- Le temps total des étapes doit correspondre au temps total de la recette
- Ajoute des conseils pratiques pour chaque étape

Important :
- Utilise "chefa" pour l'image (l'image de la mascotte sera affichée)
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
          title: description,
          description: `Recette personnalisée : ${description}`,
          category: 'Plat principal',
          difficulty: 2,
          time: 30,
          image: 'chefa',
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

