import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { incrementPlayCount } from './incrementPlayCount';

const prisma = new PrismaClient();

describe('incrementPlayCount', () => {
  let testSongId: number;

  beforeAll(async () => {
    // テスト用のアーティストを作成
    const artist = await prisma.artist.create({
      data: {
        name: 'Test Artist',
        profile: 'Test Profile',
      }
    });

    // テスト用の曲を作成
    const song = await prisma.song.create({
      data: {
        title: 'Test Song',
        artistId: artist.id,
        audio: '/uploads/test-audio.mp3',
        playCount: 0
      }
    });
    testSongId = song.id;
  });

  afterAll(async () => {
    // テストデータを削除
    const song = await prisma.song.findUnique({
      where: { id: testSongId },
      include: { artist: true }
    });

    if (song) {
      await prisma.song.delete({
        where: { id: testSongId }
      });
      await prisma.artist.delete({
        where: { id: song.artist.id }
      });
    }

    await prisma.$disconnect();
  });

  it('should increment play count by 1', async () => {
    const initialSong = await prisma.song.findUnique({
      where: { id: testSongId }
    });
    const initialCount = initialSong?.playCount || 0;

    const updatedSong = await incrementPlayCount(testSongId);

    expect(updatedSong.playCount).toBe(initialCount + 1);
  });
}); 