import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 検索エンジンからのアクセスかどうかを判定するためのRefererを取得
  const referer = request.headers.get('referer') || '';
  
  const isFromSearchEngine = 
    referer.includes('google.') || 
    referer.includes('yahoo.') || 
    referer.includes('bing.') ||
    referer.includes('duckduckgo.');

  // 検索エンジンからアクセスしてきて、かつルートページ（ホーム）以外を開こうとした場合
  if (isFromSearchEngine && request.nextUrl.pathname !== '/') {
    // ホームページ（/）へリダイレクト
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // apiや静的ファイル（画像など）にはミドルウェアを適用しない
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|videos).*)'],
};
