import getSession from '@/app/actions/getSession';
import Navbar from '@/app/components/Navbar/Navbar';

export default async function Nav() {
  const session = await getSession();
  return <Navbar session={session} />;
}
