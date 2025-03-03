import { json } from '@sveltejs/kit';
import { addSong } from '$lib/server/addSong';
import { updateSong } from '$lib/server/updateSong';

export async function POST({ request }) {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const artistId = Number(formData.get('artistId'));
  const audioFile = formData.get('audio') as File;
  const imageFile = formData.get('image') as File;

  const song = await addSong(title, artistId, audioFile, imageFile);

  return json(song);
}

export async function PUT({ request }) {
  const formData = await request.formData();
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const audioFile = formData.get('audio') as File | undefined;
  const imageFile = formData.get('image') as File | undefined;

  const song = await updateSong(id, title, imageFile, audioFile);

  return json(song);
}
