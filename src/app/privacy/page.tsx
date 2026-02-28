export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-28 px-6 md:px-16">
      <h1 className="text-2xl font-bold text-[#1d1d1f]">プライバシーポリシー</h1>

      <div className="mt-8 max-w-2xl space-y-8 text-sm leading-7 text-gray-600">
        <section>
          <h2 className="text-base font-semibold text-gray-800">1. 当サイトについて</h2>
          <p className="mt-2">
            CINEMA（以下「当サイト」）は、映画・ドラマの情報を閲覧できるサービスです。
            当サイトは個人が運営する非営利のサービスです。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800">2. 取得する情報</h2>
          <p className="mt-2">当サイトでは、以下の情報をお客様のブラウザに保存しています。</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>フォロー情報（localStorage）</strong> — お気に入りに追加した映画・ドラマの情報をブラウザ内に保存します。
              この情報はサーバーには送信されず、お客様のブラウザ内にのみ保存されます。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800">3. 外部サービスとの連携</h2>
          <p className="mt-2">当サイトでは、以下の外部サービスを利用しています。</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>TMDb API</strong> — 映画・ドラマの情報（タイトル、画像、評価等）の取得に使用しています。
              TMDbのプライバシーポリシーについては
              <a href="https://www.themoviedb.org/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline"> TMDb Privacy Policy</a>
              をご確認ください。
            </li>
            <li>
              <strong>Vercel</strong> — 当サイトのホスティングに使用しています。
              アクセス時にIPアドレス等の通信情報がVercelのサーバーを経由します。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800">4. Cookieについて</h2>
          <p className="mt-2">
            当サイトでは、Cookieを積極的に使用していません。
            ただし、ホスティングサービス（Vercel）が技術的な目的でCookieを使用する場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800">5. データの削除</h2>
          <p className="mt-2">
            ブラウザのlocalStorageに保存されたフォロー情報は、ブラウザの設定からいつでも削除できます。
            具体的には、ブラウザの「サイトデータの削除」機能をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800">6. 免責事項</h2>
          <p className="mt-2">
            当サイトに掲載されている映画・ドラマの情報はTMDb APIから取得したものであり、
            情報の正確性・最新性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-800">7. ポリシーの変更</h2>
          <p className="mt-2">
            当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。
            変更後のポリシーは当ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-4">最終更新日: 2026年2月27日</p>
      </div>
    </main>
  );
}
