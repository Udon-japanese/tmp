import { prisma } from '@/lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import CrtQuizScreen from './CrtQuizScreen';

export default async function Page({ params }: { params: { quizId: string } }) {
  const currentUser = await getCurrentUser();

  const quizDraft = await prisma.quizDraft.findUnique({
    where: {
      quizId: params.quizId,
      createdBy: currentUser?.id,
    },
    include: {
      questionDrafts: {
        include: {
          choiceDrafts: true,
        },
      },
    },
  })

  if (!(currentUser && quizDraft)) {
    redirect('/');
  }

  return (
    <CrtQuizScreen quizDraft={quizDraft} />
  );
}
