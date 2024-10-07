import puppeteer, { Page } from 'puppeteer';
import type { Recipe, RecipeJsonLd } from '../types/recipe.types';
import OpenAI from 'openai';
import env from '../config/env.config';
import { formatISO8601Duration } from '../lib/utils';

async function getRecipeWithJsonLd(page: Page) {
	const recipeData = await page.evaluate((): RecipeJsonLd | null => {
		const scriptTag = document.querySelector(
			'script[type="application/ld+json"]'
		);
		if (!scriptTag) return null;

		const jsonData = JSON.parse(scriptTag.textContent || '{}');
		if (
			jsonData['@type'] === 'Recipe' ||
			(Array.isArray(jsonData['@type']) && jsonData['@type'].includes('Recipe'))
		) {
			return jsonData as RecipeJsonLd;
		}

		return null;
	});

	if (!recipeData) return null;

	let image: string | undefined;
	if (Array.isArray(recipeData.image)) {
		image = recipeData.image[0];
	} else if (typeof recipeData.image === 'object' && recipeData.image.url) {
		image = recipeData.image.url;
	} else if (typeof recipeData.image === 'string') {
		image = recipeData.image;
	}

	const instructions = recipeData.recipeInstructions.flat().map(step => {
		if (typeof step === 'string') {
			return step;
		} else if (typeof step === 'object' && step.text) {
			return step.text;
		}
		return;
	});

	const recipe: Recipe = {
		name: recipeData.name,
		description: recipeData.description,
		image: image,
		prepTime: formatISO8601Duration(recipeData.prepTime),
		cookTime: formatISO8601Duration(recipeData.cookTime),
		totalTime: formatISO8601Duration(recipeData.totalTime),
		servings: recipeData.recipeYield,
		category: recipeData.recipeCategory,
		cuisine: recipeData.recipeCuisine,
		ingredients: recipeData.recipeIngredient,
		instructions: instructions as string[],
	};

	return recipe;
}

async function getRecipeWithOpenAi(page: Page) {
	const openAi = new OpenAI({
		apiKey: env.OPENAI_API_SECRET_KEY,
	});

	const html = await page.evaluate(() => {
		// Remove all unnecessary tags
		const elementsToRemove = document.querySelectorAll(
			'style, script, svg, nav, footer, noscript'
		);
		elementsToRemove.forEach(element => element.remove());

		// Remove all attributes from elements except for <img> elements
		const allElements = document.querySelectorAll('*');
		allElements.forEach(element => {
			if (element.tagName.toLowerCase() !== 'img') {
				Array.from(element.attributes).forEach(attr => {
					element.removeAttribute(attr.name);
				});
			} else {
				// For <img> elements, remove all attributes except 'src'
				Array.from(element.attributes).forEach(attr => {
					if (attr.name !== 'src') {
						element.removeAttribute(attr.name);
					}
				});
			}
		});

		// Return the cleaned body content
		return document.body.innerHTML;
	});

	const response = await openAi.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `Here is the HTML to a recipe website: ${html}. Extract the recipe and return it in the following JSON format. No additional text or explanations are needed:
				{
					name: string;
					description: string;
					image: string | null;
					prepTime?: string;
					cookTime?: string;
					totalTime?: string;
					servings?: string | number;
					category?: string;
					cuisine?: string;
					ingredients: string[] | string[][];
					instructions: string[]
				}`,
			},
		],
		model: 'gpt-4-turbo-preview',
	});

	let content = response.choices[0].message.content?.trim();

	if (!content) return null;

	if (content.startsWith('```json')) {
		content = content.substring(7).trim();
	}

	if (content.endsWith('```')) {
		content = content.substring(0, content.length - 3).trim();
	}

	return JSON.parse(content) as Recipe;
}

export async function scrapeRecipe(url: string) {
	// const browser = await puppeteer.connect({
	// 	browserWSEndpoint: `wss://${env.BRIGHTDATA_USERNAME}:${env.BRIGHTDATA_PASSWORD}@${env.BRIGHTDATA_HOST}`,
	// });
	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	await page.goto(url, { waitUntil: 'networkidle2' });
	let source: 'json-ld' | 'openai' | 'none' = 'none';
	let recipe: Recipe | null = await getRecipeWithJsonLd(page);

	if (!recipe) {
		recipe = await getRecipeWithOpenAi(page);

		if (!recipe) {
			recipe = null;
			source = 'none';
		} else source = 'openai';
	} else source = 'json-ld';

	await browser.close();

	return {
		recipe,
		source,
	};
}
