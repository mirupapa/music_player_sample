import type { SongWithArtist } from '$lib/type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listSong(params?: { ids?: number[]; artistId?: number ;  }): Promise<SongWithArtist[]> {
  if (params?.ids) {
    return await prisma.song.findMany({
      where: {
        id: {
          in: params.ids
        }
      },
      include: { artist: true }
    });
  }

  if (params?.artistId) {
    return await prisma.song.findMany({
      where: {
        artistId: params.artistId
      },
      include: { artist: true }
    });
  }

  return await prisma.song.findMany({
    include: { artist: true }
  });
}
