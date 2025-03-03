<script lang="ts">
  import { onMount } from 'svelte';
  import { isPlaying, currentSong, currentVolume, playbackTime, audioDuration, playSong, stopSong, setVolume } from '$lib/module/player';
  import { get } from 'svelte/store';

  let playbackTimeFormatted = '0:00';
  let durationFormatted = '0:00';

  // 時間を MM:SS 形式にフォーマット
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 再生/一時停止の切り替え
  function togglePlay() {
    const song = get(currentSong);
    if (!song) return;

    if (get(isPlaying)) {
      stopSong();
    } else {
      playSong(song);
    }
  }

  // 音量変更
  function handleVolumeChange(e: Event) {
    const volume = Number((e.target as HTMLInputElement).value) / 100;
    setVolume(volume);
  }

  // 再生時間の監視
  $: playbackTimeFormatted = formatTime($playbackTime);
  $: durationFormatted = formatTime($audioDuration);
</script>

<div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
  <div class="container mx-auto flex items-center justify-between">
    <!-- 曲情報 -->
    <div class="flex items-center gap-4">
      <img src={$currentSong?.image || '/img/song_default.webp'} alt="アルバムアート" class="w-16 h-16 object-cover" />
      <div>
        <p class="font-bold">{$currentSong?.title || '曲のタイトル'}</p>
        <p class="text-sm text-gray-400">{$currentSong?.artist.name || 'アーティスト名'}</p>
      </div>
    </div>

    <!-- 再生コントロール -->
    <div class="flex flex-col items-center gap-2">
      <button 
        class="w-10 h-10 rounded-full bg-white flex items-center justify-center"
        on:click={togglePlay}
      >
        {#if $isPlaying}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        {/if}
      </button>

      <!-- 進行バー -->
      <div class="flex items-center gap-2">
        <span class="text-sm">{playbackTimeFormatted}</span>
        <div class="w-40 h-1 bg-gray-600">
          <div 
            class="h-full bg-white" 
            style="width: {($playbackTime / $audioDuration) * 100}%"
          ></div>
        </div>
        <span class="text-sm">{durationFormatted}</span>
      </div>
    </div>

    <!-- 音量コントロール -->
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 4.5L4 8H2v8h2l4.5 3.5V4.5zm4.5 2.5c1.5 1.5 1.5 7 0 8.5m3-11c3 3 3 10.5 0 13.5"/>
      </svg>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={$currentVolume * 100} 
        on:input={handleVolumeChange}
        class="w-20" 
      />
    </div>
  </div>
</div>
