import { Heading } from '@/components/ui/heading';
import ImportRecipeForm from './ImportRecipeForm';

export default function HeroFormCenterAlignedSearchWithTags() {
	return (
		<section>
			<Heading variant={'h2'} className='mb-6'>
				Import Recipe
			</Heading>
			<ImportRecipeForm />
		</section>
	);
}
