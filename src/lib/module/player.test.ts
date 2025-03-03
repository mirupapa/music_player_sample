import { describe, it, expect, beforeEach, afterEach, vi, type MockInstance } from 'vitest';
import { get } from 'svelte/store';
import { playSong, stopSong, setVolume, isPlaying, currentSong, currentAudio, audioDuration, currentVolume } from './player';
import type { SongWithArtist } from '$lib/type';

describe('Player Module', () => {
  // モックのAudioオブジェクト
  let mockAudio: HTMLAudioElement;
  
  // テスト用の曲データ
  const testSong: SongWithArtist = {
    id: 1,
    title: 'Test Song',
    audio: 'test-audio.mp3',
    artistId: 1,
    image: null,
    artist: {
      id: 1,
      name: 'Test Artist',
      profile: 'Test Profile',
      image: null
    }
  };

  beforeEach(() => {
    // Audio要素のモック
    mockAudio = {
      play: vi.fn(),
      pause: vi.fn(),
      remove: vi.fn(),
      addEventListener: vi.fn(),
      volume: 1,
      duration: 180,
      currentTime: 0
    } as unknown as HTMLAudioElement;

    // グローバルのAudioコンストラクタをモック
    vi.stubGlobal('Audio', vi.fn(() => mockAudio));

    // ストアをリセット
    isPlaying.set(false);
    currentSong.set(null);
    currentAudio.set(null);
    audioDuration.set(0);
    currentVolume.set(1);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('playSong', () => {
    it('should start playing a new song', () => {
      playSong(testSong);

      expect(get(isPlaying)).toBe(true);
      expect(get(currentSong)).toEqual(testSong);
      expect(mockAudio.play).toHaveBeenCalled();
    });

    it('should resume playing the same song', () => {
      // 最初に曲を設定
      currentSong.set(testSong);
      currentAudio.set(mockAudio);
      isPlaying.set(false);

      // 同じ曲を再生
      playSong(testSong);

      expect(get(isPlaying)).toBe(true);
      expect(mockAudio.play).toHaveBeenCalled();
    });

    it('should handle metadata loaded event', () => {
      playSong(testSong);

      // loadedmetadataイベントのコールバックを取得して実行
      const loadedMetadataCallback = mockAudio.addEventListener.mock.calls.find(
        call => call[0] === 'loadedmetadata'
      )[1];
      loadedMetadataCallback();

      expect(get(audioDuration)).toBe(180);
    });

    it('should handle ended event', () => {
      playSong(testSong);

      // endedイベントのコールバックを取得して実行
      const endedCallback = mockAudio.addEventListener.mock.calls.find(
        call => call[0] === 'ended'
      )[1];
      endedCallback();

      expect(get(isPlaying)).toBe(false);
    });
  });

  describe('stopSong', () => {
    it('should pause the current song', () => {
      // 再生中の状態を設定
      currentAudio.set(mockAudio);
      isPlaying.set(true);

      stopSong();

      expect(get(isPlaying)).toBe(false);
      expect(mockAudio.pause).toHaveBeenCalled();
    });
  });

  describe('setVolume', () => {
    it('should set the volume between 0 and 1', () => {
      currentAudio.set(mockAudio);

      setVolume(0.5);
      expect(get(currentVolume)).toBe(0.5);
      expect(mockAudio.volume).toBe(0.5);

      // 範囲外の値は無視される
      setVolume(1.5);
      expect(get(currentVolume)).toBe(0.5);
      expect(mockAudio.volume).toBe(0.5);

      setVolume(-0.5);
      expect(get(currentVolume)).toBe(0.5);
      expect(mockAudio.volume).toBe(0.5);
    });
  });
}); 