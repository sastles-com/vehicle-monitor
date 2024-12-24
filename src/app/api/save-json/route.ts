import { NextRequest, NextResponse } from 'next/server';

import * as fs from 'fs/promises';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filename, data } = await request.json();

    // セキュリティ: ファイル名のバリデーション
    if (!filename || !filename.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // 公開ディレクトリのパスを取得
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, filename);

    // ファイルを書き込み
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ message: 'File saved successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}