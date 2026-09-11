import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function proxy(request) {
  // next.config.mjs tiene trailingSlash: true, así que el pathname que llega
  // acá ya viene normalizado con "/" al final (comparar sin considerarlo
  // produce un loop de redirects entre /admin/login y /admin/login/).
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login" || pathname === "/admin/login/";

  // Todavía no se configuró Supabase (ver .env.example): no hay forma de
  // autenticarse, así que mandamos todo a /admin/login en vez de romper.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (isLoginRoute) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login/";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login/";
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
