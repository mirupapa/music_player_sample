import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function addSong(title: string, artistId: number, audioFile: File, imageFile: File) {
  // アップロードディレクトリのパスを設定
  const uploadDir = path.join(process.cwd(), 'static', 'uploads');

  // 音声ファイルを保存
  const audioFileName = `${uuidv4()}${path.extname(audioFile.name)}`;
  const audioFilePath = path.join(uploadDir, audioFileName);
  const audioBuffer = await audioFile.arrayBuffer();
  fs.writeFileSync(audioFilePath, Buffer.from(audioBuffer));

  // 画像ファイルを保存
  const imageFileName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const imageFilePath = path.join(uploadDir, imageFileName);
  const imageBuffer = await imageFile.arrayBuffer();
  fs.writeFileSync(imageFilePath, Buffer.from(imageBuffer));

  // 曲情報をデータベースに保存
  const song = await prisma.song.create({
    data: {
      title,
      artistId,
      audio: `/uploads/${audioFileName}`,
      image: `/uploads/${imageFileName}`,
    },
  });

  return song;
}
