import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Sadece anasayfaya girişte çalış
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  // TEST İÇİN TARİHLERİ BURADAN DEĞİŞTİR
  // Sunumda kolayca test edebilmek için bu tarihleri değiştirebilirsiniz
  const FINAL_DATE = new Date('2026-01-01T00:00:00'); // 1 Ocak 2026
  const LOCKDOWN_DATE = new Date('2025-12-28T00:00:00'); // 28 Aralık 2025
  const now = new Date();

  // 1. TARİH KONTROLÜ
  // Eğer 1 Ocak 2026 veya sonrası ise -> /final sayfasına yönlendir
  if (now >= FINAL_DATE) {
    return NextResponse.redirect(new URL('/final', request.url));
  }

  // Eğer 28 Aralık 2025 veya sonrası ise -> /lockdown sayfasına yönlendir
  if (now >= LOCKDOWN_DATE) {
    return NextResponse.redirect(new URL('/lockdown', request.url));
  }

  // 2. ÇEREZ (COOKIE) KONTROLÜ (28 Aralık öncesi için)
  // hasVoted cookie'sini kontrol et
  const hasVoted = request.cookies.get('hasVoted');

  // Eğer hasVoted cookie'si varsa -> /dashboard'a yönlendir
  if (hasVoted) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // hasVoted yoksa -> Anasayfada kalsın (normal akış)
  return NextResponse.next();
}

// Config: Sadece anasayfa için çalış
export const config = {
  matcher: '/',
};

