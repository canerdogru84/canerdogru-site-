import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * E-posta bağlantısından dönüş: ?code= → oturum çerezi → /panel.
 * panel_kullanicilari'nda eşleşme yoksa (ic)/layout "yetkisiz" ile girişe geri atar.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const hedef = new URL("/panel", req.url);
  if (!code) return NextResponse.redirect(new URL("/panel/giris?hata=gecersiz", req.url));

  const res = NextResponse.redirect(hedef);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.redirect(new URL("/panel/giris?hata=gecersiz", req.url));

  const sb = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  });
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/panel/giris?hata=gecersiz", req.url));
  return res;
}
