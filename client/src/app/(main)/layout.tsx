import { AppSidebar } from '@/components/app-sidebar';
import { SidebarLayout, SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();

	return (
		<SidebarLayout
			defaultOpen={cookieStore.get('sidebar:state')?.value === 'true'}
		>
			<AppSidebar />
			<main className='flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out'>
				<div className='h-full rounded-md border-2 border-dashed p-2'>
					<SidebarTrigger />
					{children}
				</div>
			</main>
		</SidebarLayout>
	);
}
