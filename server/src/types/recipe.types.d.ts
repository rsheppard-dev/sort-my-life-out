import { z } from 'zod';
import { importRecipeDto } from '../dtos/recipe.dtos';

type ImportRecipeParams = z.infer<typeof importRecipeDto>['params'];

type ImageObject = {
	'@type': 'ImageObject';
	url: string;
	height?: number;
	width?: number;
};

type Person = {
	'@type': 'Person';
	name: string;
	url?: string;
};

type Organization = {
	'@type': 'Organization';
	name: string;
	url: string;
	logo?: ImageObject;
};

type NutritionInformation = {
	'@type': 'NutritionInformation';
	calories?: string;
	fatContent?: string;
	saturatedFatContent?: string;
	carbohydrateContent?: string;
	sugarContent?: string;
	fiberContent?: string;
	proteinContent?: string;
	sodiumContent?: string;
};

type HowToStep = {
	'@type': 'HowToStep';
	text: string;
};

type RecipeJsonLd = {
	'@context': string;
	'@type': 'Recipe';
	'@id'?: string;
	name: string;
	description?: string;
	image?: ImageObject;
	author?: Person | Person[];
	datePublished?: string;
	dateModified?: string;
	headline?: string;
	keywords?: string;
	publisher?: Organization;
	cookTime?: string;
	prepTime?: string;
	totalTime?: string;
	recipeCategory?: string;
	recipeCuisine?: string;
	recipeIngredient: string[];
	recipeInstructions: HowToStep[] | string[];
	recipeYield?: string | number;
	nutrition?: NutritionInformation;
	mainEntityOfPage?: {
		'@type': 'WebPage';
		'@id': string;
	};
	isAccessibleForFree?: string;
	hasPart?: {
		'@type': 'WebPageElement';
		isAccessibleForFree: string;
		cssSelector: string;
	};
};

type Recipe = {
	name: string;
	description?: string;
	image?: string;
	prepTime?: string;
	cookTime?: string;
	totalTime?: string;
	servings?: string | number;
	category?: string;
	cuisine?: string;
	ingredients: string[] | string[][];
	instructions: string[];
};

type RecipeJsonResponse = {
	recipe: Recipe | null;
	source: 'openai' | 'json-ld' | 'cache' | 'none';
};
