<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import type { Song } from '@prisma/client';

  let songs: Song[] = [];
  let error: string | null = null;

  onMount(async () => {
    try {
      const artistId = $page.params.id;
      const response = await fetch(`/api/songs?artistId=${artistId}`);
      
      if (!response.ok) {
        const data = await response.json();
        error = data.error || '曲の取得に失敗しました';
        return;
      }

      songs = await response.json();
    } catch (e) {
      error = '曲の取得中にエラーが発生しました';
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if songs.length === 0}
    <p class="text-gray-500 text-center">このアーティストの曲はまだありません</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each songs as song}
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={song.image || '/img/song_default.webp'} 
            alt={song.title} 
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{song.title}</h2>
           </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
