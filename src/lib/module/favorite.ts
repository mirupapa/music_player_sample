import { writable } from 'svelte/store';

// お気に入りの曲IDリストを保持するストア
export const favoriteIds = writable<number[]>([]);

// ローカルストレージのキー
const STORAGE_KEY = 'favorite_songs';

// 初期化時にローカルストレージから読み込む
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    favoriteIds.set(JSON.parse(stored));
  }
}

/**
 * お気に入りに曲を追加
 */
export function addToFavorite(songId: number): void {
  favoriteIds.update(ids => {
    if (!ids.includes(songId)) {
      const newIds = [...ids, songId];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      }
      return newIds;
    }
    return ids;
  });
}

/**
 * お気に入りから曲を削除
 */
export function removeFromFavorite(songId: number): void {
  favoriteIds.update(ids => {
    const newIds = ids.filter(id => id !== songId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    }
    return newIds;
  });
}

/**
 * お気に入りの曲IDリストを取得
 */
export function getFavorite(): number[] {
  let ids: number[] = [];
  favoriteIds.subscribe(value => {
    ids = value;
  })();
  return ids;
}
