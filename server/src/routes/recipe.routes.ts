import { Router } from 'express';
import { importRecipeHandler } from '../controllers/recipe.controllers';

const router = Router();

router.get('/', (req, res) => {
	res.send('Hello, World!');
});

router.get('/import/:url', importRecipeHandler);

export default router;
