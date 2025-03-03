import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function incrementPlayCount(id: number) {
  return await prisma.song.update({
    where: { id },
    data: {
      playCount: {
        increment: 1
      }
    }
  });
} 