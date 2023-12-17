import getCurrentUser from '@/app/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';

export default async function Page() {
  const currentUser = await getCurrentUser();
  const quizzesOfCurrentUser = await prisma.quiz.findMany({
    where: { createdBy: currentUser?.id },
  });

  return (
    <>
      <h1>{currentUser?.name} が作ったクイズ一覧</h1>
      <div className="mt-10 mx-4">
        {quizzesOfCurrentUser.map((quiz) => (
          <a
            className="bg-gray-300 block rounded-lg px-4 py-6 my-3"
            key={quiz.id}
            href={`/quiz/edit/${quiz.id}`}
          >
            {quiz.title}, {quiz.description || '説明なし'}
          </a>
        ))}
      </div>
    </>
  );
}
