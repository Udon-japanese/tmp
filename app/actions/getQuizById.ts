import { prisma } from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getQuizById = async (
  quizId: string
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!(currentUser?.email && currentUser.id)) {
      return null;
    }
  
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId
      },
    });

    return quiz;
  } catch (error: any) {
    console.log(error, 'SERVER_ERROR')
    return null;
  }
};

export default getQuizById;