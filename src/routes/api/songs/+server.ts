import { json, type RequestEvent } from '@sveltejs/kit';
import { listSong } from '$lib/server/listSong';
import { addSong } from '$lib/server/addSong.js';

export async function GET({ url }) {
  const ids = url.searchParams.get('ids');
  const artistId = url.searchParams.get('artistId');

  const params: { ids?: number[]; artistId?: number ;  } = { };

  if (ids) {
    const songIds = ids.split(',').map(id => parseInt(id, 10));
    if (songIds.some(isNaN)) {
      return json({ error: '無効な曲IDです' }, { status: 400 });
    }
    params.ids = songIds;
  }

  if (artistId) {
    const parsedArtistId = parseInt(artistId, 10);
    if (isNaN(parsedArtistId)) {
      return json({ error: '無効なアーティストIDです' }, { status: 400 });
    }
    params.artistId = parsedArtistId;
  }

   const songs = await listSong(params); 

  return json(songs, { status: 200 });
}


export async function POST({ request }: RequestEvent) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const artistId = parseInt(formData.get('artistId') as string);
    const audio = formData.get('audio') as File;
    const image = formData.get('image') as File;

    const song = await addSong(title, artistId, audio, image);
    return json(song);
  } catch (error) {
    console.error(error);
    return new Response('Failed to create song', { status: 500 });
  }
}
