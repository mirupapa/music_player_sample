import { json } from '@sveltejs/kit';
import { listSong } from '$lib/server/listSong';

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

  console.log(songs);

  return json(songs, { status: 200 });
}
