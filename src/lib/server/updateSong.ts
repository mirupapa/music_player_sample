import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function updateSong(id: number, title: string, imageFile?: File, audioFile?: File) {
  let imagePath = null;
  let audioPath = null;

  if (imageFile) {
    // 画像ファイルを保存するパスを設定
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const filePath = path.join(uploadDir, imageFile.name);

    // 画像ファイルを保存
    const buffer = await imageFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    imagePath = `/uploads/${imageFile.name}`;
  }

  if (audioFile) {
    // 音声ファイルを保存するパスを設定
    const uploadDir = path.join(process.cwd(), 'static', 'uploads');
    const filePath = path.join(uploadDir, audioFile.name);

    // 音声ファイルを保存
    const buffer = await audioFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    audioPath = `/uploads/${audioFile.name}`;
  }

  // 曲情報をデータベースで更新
  const updatedSong = await prisma.song.update({
    where: { id },
    data: {
      title,
      ...(imagePath && { image: imagePath }),
      ...(audioPath && { audio: audioPath })
    },
  });

  return updatedSong;
}
