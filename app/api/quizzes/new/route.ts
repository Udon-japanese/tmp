import { v4 as uuidV4 } from 'uuid';
import { prisma } from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { setTitleAndDescFormSchema } from '@/app/types';

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!(currentUser?.email && currentUser.id)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body: unknown = await req.json();
  const result = setTitleAndDescFormSchema.safeParse(body);
  let zodErrs = {};

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrs = { ...zodErrs, [issue.path[0]]: issue.message };
    });

    return NextResponse.json({ errors: zodErrs });
  } else {
    const quizId = uuidV4();

    const quiz = await prisma.quiz.create({
      data: {
        id: quizId,
        title: result.data.title,
        description: result.data.description,
        createdBy: currentUser?.id,
      }
    });

    await prisma.quizDraft.create({
      data: {
        quizId: quizId,
        title: result.data.title,
        description: result.data.description,
        createdBy: currentUser?.id,
      }
    });

    return NextResponse.json(quiz);
  }
}
