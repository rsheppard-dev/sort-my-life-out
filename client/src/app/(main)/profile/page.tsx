import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UpdateProfileForm from '@/components/user/UpdateProfileForm';
import UpdateEmailForm from '@/components/user/UpdateEmailForm';

export default function page() {
	return (
		<section>
			<div className='flex gap-4 items-center mb-4'>
				<Avatar className='h-20 w-20'>
					<AvatarImage />
					<AvatarFallback className='text-4xl font-bold'>RS</AvatarFallback>
				</Avatar>
				<div>
					<h1 className='font-bold text-2xl'>Roy Sheppard</h1>
					<span className='text-muted-foreground'>
						info@roysheppard.digital
					</span>
				</div>
			</div>
			<Separator className='mb-4' />
			<Tabs defaultValue='profile' className='flex flex-col md:flex-row gap-4'>
				<TabsList className='flex flex-row md:flex-col w-fit md:w-[150px] justify-start gap-2 items-start h-full mt-2'>
					<TabsTrigger value='profile' className='w-full justify-start'>
						Profile
					</TabsTrigger>
					<TabsTrigger value='email' className='w-full justify-start'>
						Email
					</TabsTrigger>
					<TabsTrigger value='password' className='w-full justify-start'>
						Password
					</TabsTrigger>
				</TabsList>
				<div>
					<TabsContent value='profile'>
						<UpdateProfileForm />
					</TabsContent>
					<TabsContent value='email'>
						<UpdateEmailForm />
					</TabsContent>
					<TabsContent value='password'>
						<Card>
							<CardHeader>
								<CardTitle>Password</CardTitle>
								<CardDescription>
									Change your password here. After saving, you&apos;ll be logged
									out.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-2'>
								<div className='space-y-1'>
									<Label htmlFor='current'>Current password</Label>
									<Input id='current' type='password' />
								</div>
								<div className='space-y-1'>
									<Label htmlFor='new'>New password</Label>
									<Input id='new' type='password' />
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save password</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</div>
			</Tabs>
		</section>
	);
}
