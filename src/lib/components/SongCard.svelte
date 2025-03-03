<script lang="ts">
  import type { SongWithArtist } from '$lib/type';
  import { favoriteIds, addToFavorite, removeFromFavorite } from '$lib/module/favorite';
  import { get } from 'svelte/store';
  import { playSong, stopSong, isPlaying, currentSong } from '$lib/module/player';
 
  export let song: SongWithArtist;

  let localPlayCount = song.playCount || 0;

  function handleFavorite() {
    const ids = get(favoriteIds);
    if (ids.includes(song.id)) {
      removeFromFavorite(song.id);
      alert('お気に入りから削除しました');
    } else {
      addToFavorite(song.id);
      alert('お気に入りに追加しました');
    }
  }

  function handlePlay() {
    const current = get(currentSong);
    const playing = get(isPlaying);

    if (current?.id === song.id && playing) {
      stopSong();
    } else {
      playSong(song);
      // 同じ曲の再生/一時停止の場合はカウントを増やさない
      if (current?.id !== song.id) {
        localPlayCount++;
      }
    }
  }
</script>

<div class="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-4">
  <div class="w-48 h-48">
    <img 
      src={song.image ?? '/img/song_default.webp'} 
      alt={song.title}
      class="w-full h-full object-cover rounded-lg"
    />
  </div>

  <div class="text-center">
    <h3 class="text-xl font-bold text-white">{song.title}</h3>
    <p class="text-gray-400 text-sm">再生数: {localPlayCount}回</p>
    <a 
      href="/artists/{song.artistId}" 
      class="text-gray-300 hover:text-white"
    >
      {song.artist.name}
    </a>
  </div>

  <div class="flex gap-4">
    <button
      class="bg-white text-gray-800 rounded-full p-2 hover:bg-gray-200"
      aria-label={$currentSong?.id === song.id && $isPlaying ? '一時停止' : '再生'}
      on:click={handlePlay}
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        {#if $currentSong?.id === song.id && $isPlaying}
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        {:else}
          <path d="M8 5v14l11-7z" />
        {/if}
      </svg>
    </button>

    <button
      class="bg-white text-gray-800 rounded-full p-2 hover:bg-gray-200"
      aria-label={$favoriteIds.includes(song.id) ? 'お気に入りから削除' : 'お気に入りに追加'}
      on:click={handleFavorite}
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        {#if $favoriteIds.includes(song.id)}
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        {:else}
          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
        {/if}
      </svg>
    </button>
  </div>
</div>
