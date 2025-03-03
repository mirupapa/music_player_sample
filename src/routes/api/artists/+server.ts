
import { json } from '@sveltejs/kit';
import { listArtist } from '$lib/server/listArtist';

export async function GET({ url }) {
  const id = url.searchParams.get('id');
  const artistId = id ? parseInt(id, 10) : undefined;

  if (artistId && isNaN(artistId)) {
    return json({ error: 'Invalid artist ID' }, { status: 400 });
  }

  const artist = await listArtist(artistId);

  if (artistId && !artist) {
    return json({ error: 'Artist not found' }, { status: 404 });
  }

  return json(artist, { status: 200 });
}
