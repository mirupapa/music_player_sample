import type { ArtistWithSongs } from '$lib/type';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listArtist(id?: number): Promise<ArtistWithSongs[] | ArtistWithSongs | null> {
  if (id) {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: { songs: true }
    });
    return artist;
  } else {
    const artists = await prisma.artist.findMany({
      include: { songs: true }
    });
    return artists;
  }
}


