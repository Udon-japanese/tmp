import { prisma } from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { setTitleAndDescFormSchema } from '@/app/types';
import { z } from 'zod';

const updatedQuizDataSchema = setTitleAndDescFormSchema.extend({
  id: z.string().uuid({ message: 'クイズidはUUIDである必要があります' }),
});

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!(currentUser?.email && currentUser.id)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body: unknown = await req.json();
  const result = updatedQuizDataSchema.safeParse(body);
  let zodErrs = {};

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrs = { ...zodErrs, [issue.path[0]]: issue.message };
    });

    return NextResponse.json({ errors: zodErrs });
  } else {
    const quizId = result.data.id;
    const updatedQuizData = {
      title: result.data.title,
      description: result.data.description,
    }
    const updatedQuiz = await prisma.quiz.update({
      where: {
        id: quizId,
      },
      data: updatedQuizData,
    });

    await prisma.quizDraft.update({
      where: {
        quizId,
      },
      data: updatedQuizData,
    })

    return NextResponse.json(updatedQuiz);
  }
}
