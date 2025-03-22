<script lang="ts">
  import type { SongWithArtist, ArtistWithSongs } from "$lib/type";
  import { onMount } from 'svelte';
  import SongCard from "$lib/components/SongCard.svelte";
  import ArtistCard from "$lib/components/ArtistCard.svelte";

  let artists: ArtistWithSongs[] = [];
  let songs: SongWithArtist[] = [];

  onMount(async () => {
    const artistsResponse = await fetch('/api/artists');
    if (!artistsResponse.ok) {
      console.error('アーティストの取得に失敗しました');
      return;
    }
    artists = await artistsResponse.json();

    const songsResponse = await fetch('/api/songs');
    if (!songsResponse.ok) {
      console.error('曲の取得に失敗しました');
      return;
    }
    songs = await songsResponse.json();
  });
</script>

<div class="min-h-screen bg-gray-700 p-8 mb-20">
  <section class="mb-12">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">アーティスト一覧</h2>
      <a href="/artists/new" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
        アーティストを追加
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each artists as artist}
        <ArtistCard {artist} />
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold text-white mb-6">曲一覧</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each songs as song}
        <SongCard {song} />
      {/each}
    </div>
  </section>
</div>
