import { writable, readable } from 'svelte/store';
import type { SongWithArtist } from '$lib/type'; 

// 再生状態を管理するストア
export const isPlaying = writable(false);

// 現在の曲を管理するストア
export const currentSong = writable<SongWithArtist | null>(null);

// 現在のオーディオを管理するストア
export const currentAudio = writable<HTMLAudioElement | null>(null);

// 曲の長さを管理するストア
export const audioDuration = writable(0);

// 音量を管理するストア (0-1の範囲)
export const currentVolume = writable(1);

// 再生位置を管理するストア
export const playbackTime = readable(0, (set) => {
  let interval: NodeJS.Timeout;

  const unsubscribe = currentAudio.subscribe((audio) => {
    if (audio) {
      interval = setInterval(() => {
        set(audio.currentTime);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  return () => {
    unsubscribe();
    if (interval) clearInterval(interval);
  };
});

// 曲を再生する関数
export function playSong(song: SongWithArtist) {
  currentSong.update(current => {
    if (current?.id === song.id) {
      // 同じ曲の場合は再生を再開
      currentAudio.update(audio => {
        if (audio) {
          audio.play();
          isPlaying.set(true);
        }
        return audio;
      });
      return current;
    }

    // 異なる曲の場合は新しい曲を再生
    currentAudio.update(audio => {
      if (audio) {
        audio.pause();
        audio.remove();
      }
      const newAudio = new Audio(`${song.audio}`);
      newAudio.volume = 1;
      
      newAudio.addEventListener('loadedmetadata', () => {
        audioDuration.set(newAudio.duration);
      });

      newAudio.addEventListener('ended', () => {
        isPlaying.set(false);
      });

      // 再生数をインクリメント
      fetch(`/api/song/${song.id}`, {
        method: 'PUT',
      }); 

      newAudio.play();
      isPlaying.set(true);
      return newAudio;
    });

    return song;
  });
}

// 曲を停止する関数
export function stopSong() {
  currentAudio.update(audio => {
    if (audio) {
      audio.pause();
      isPlaying.set(false);
    }
    return audio;
  });
}

// 音量を設定する関数
export function setVolume(volume: number) {
  if (volume < 0 || volume > 1) return;
  
  currentVolume.set(volume);
  currentAudio.update(audio => {
    if (audio) {
      audio.volume = volume;
    }
    return audio;
  });
}

// 現在の再生位置を取得する関数
export function getCurrentTime(): number {
  let time = 0;
  currentAudio.update(audio => {
    if (audio) {
      time = audio.currentTime;
    }
    return audio;
  });
  return time;
}

// 総再生時間を取得する関数
export function getDuration(): number {
  let duration = 0;
  currentAudio.update(audio => {
    if (audio) {
      duration = audio.duration;
    }
    return audio;
  });
  return duration;
}

