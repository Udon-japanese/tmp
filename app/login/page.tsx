import { redirect } from 'next/navigation';
import LoginForm from '@/app/components/Login/LoginForm';
import getSession from '@/app/actions/getSession';

export default async function Page() {
  const session = await getSession();
  if (session) {
    return redirect('/');
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
      <LoginForm />
    </div>
  );
}
