import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

const headingVariants = cva('scroll-m-20 tracking-tight', {
	variants: {
		variant: {
			h1: 'text-4xl font-extrabold lg:text-5xl',
			h2: 'border-b pb-2 text-3xl font-semibold first:mt-0',
			h3: 'text-2xl font-semibold',
			h4: 'text-xl font-semibold',
		},
	},
	defaultVariants: {
		variant: 'h1',
	},
});

export interface HeadingProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingVariants> {
	asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	({ className, variant = 'h1', asChild = false, ...props }, ref) => {
		const Comp: React.ElementType = asChild
			? Slot
			: (`h${variant?.slice(1)}` as keyof JSX.IntrinsicElements);
		return (
			<Comp
				className={cn(headingVariants({ variant }), className)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Heading.displayName = 'Heading';

export { Heading, headingVariants };
