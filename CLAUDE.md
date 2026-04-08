# CLAUDE.md - プロジェクトルール

## セキュリティ厳守事項

- **APIキーをコードに直書きしない**（ハードコード禁止）
- 環境変数は必ず `.env.local` から読み込む（`process.env.VARIABLE_NAME`）
- `.env.local` の内容をチャットに貼らない・読み上げない
- シークレット情報を含むファイルをコミットしない

## プロジェクト概要

- Next.js製の映画・ドラマ情報サイト（TMDb API使用）
- デプロイ先: Vercel

## 技術スタック

- Next.js, TypeScript, Tailwind CSS
- react-icons, lucide-react
- TMDb API（映画・人物データ）

## コーディングルール

- 環境変数のキー名を変更・追加する場合はユーザーに確認する
- `.gitignore` に `.env*` が含まれていることを確認してからコミットする
