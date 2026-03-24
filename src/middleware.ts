import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 悪意のあるボットのUser-Agentパターン
const BLOCKED_UA_PATTERNS = [
  /semrush/i,
  /ahref/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /ccbot/i,
  /claudebot/i,
  /anthropic/i,
  /scrapy/i,
  /httpclient/i,
  /python-requests/i,
  /go-http-client/i,
  /curl\//i,
  /wget\//i,
  /libwww/i,
  /java\//i,
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
];

// 簡易レート制限用（エッジランタイムで動作）
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 60秒
const RATE_LIMIT_MAX = 100; // 60秒あたり100リクエスト

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// 古いエントリを定期的にクリーンアップ
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(ip);
    }
  }
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 1. User-Agentが空 → ブロック
  if (!ua || ua.length < 5) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. 悪意のあるボットUA → ブロック
  if (BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. レート制限チェック
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // 定期クリーンアップ（100リクエストごと）
  if (Math.random() < 0.01) {
    cleanupRateLimit();
  }

  return NextResponse.next();
}

// 静的ファイルとNext.js内部ルートは除外
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js).*)",
  ],
};
