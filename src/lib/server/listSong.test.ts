import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { listSong } from './listSong';

const prisma = new PrismaClient();

describe('listSong', () => {
  let testArtist1Id: number;
  let testArtist2Id: number;
  let testSong1Id: number;
  let testSong2Id: number;
  let testSong3Id: number;

  beforeAll(async () => {
    // テスト用のアーティストを作成
    const artist1 = await prisma.artist.create({
      data: {
        name: 'Test Artist 1',
        profile: 'Test Profile 1',
      }
    });
    testArtist1Id = artist1.id;

    const artist2 = await prisma.artist.create({
      data: {
        name: 'Test Artist 2',
        profile: 'Test Profile 2',
      }
    });
    testArtist2Id = artist2.id;

    // テスト用の曲を作成
    const song1 = await prisma.song.create({
      data: {
        title: 'Test Song 1',
        artistId: testArtist1Id,
        audio: '/uploads/test-audio1.mp3',
      }
    });
    testSong1Id = song1.id;

    const song2 = await prisma.song.create({
      data: {
        title: 'Test Song 2',
        artistId: testArtist1Id,
        audio: '/uploads/test-audio2.mp3',
      }
    });
    testSong2Id = song2.id;

    const song3 = await prisma.song.create({
      data: {
        title: 'Test Song 3',
        artistId: testArtist2Id,
        audio: '/uploads/test-audio3.mp3',
      }
    });
    testSong3Id = song3.id;
  });

  afterAll(async () => {
    // テストデータを削除
    await prisma.song.deleteMany({
      where: {
        id: {
          in: [testSong1Id, testSong2Id, testSong3Id]
        }
      }
    });
    await prisma.artist.deleteMany({
      where: {
        id: {
          in: [testArtist1Id, testArtist2Id]
        }
      }
    });

    await prisma.$disconnect();
  });

  it('should list all songs when no params are provided', async () => {
    const songs = await listSong();
    
    expect(songs).toHaveLength(3);
    expect(songs.map(song => song.id)).toContain(testSong1Id);
    expect(songs.map(song => song.id)).toContain(testSong2Id);
    expect(songs.map(song => song.id)).toContain(testSong3Id);
    expect(songs[0].artist).toBeDefined();
  });

  it('should list songs by specific ids', async () => {
    const songs = await listSong({ ids: [testSong1Id, testSong2Id] });
    
    expect(songs).toHaveLength(2);
    expect(songs.map(song => song.id)).toContain(testSong1Id);
    expect(songs.map(song => song.id)).toContain(testSong2Id);
    expect(songs.map(song => song.id)).not.toContain(testSong3Id);
    expect(songs[0].artist).toBeDefined();
  });

  it('should list songs by artist id', async () => {
    const songs = await listSong({ artistId: testArtist1Id });
    
    expect(songs).toHaveLength(2);
    expect(songs.map(song => song.id)).toContain(testSong1Id);
    expect(songs.map(song => song.id)).toContain(testSong2Id);
    expect(songs.map(song => song.id)).not.toContain(testSong3Id);
    expect(songs[0].artist.id).toBe(testArtist1Id);
  });
}); 