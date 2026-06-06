import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/wardrobe", "/style", "/outfits", "/favorites", "/shopping"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, allow all requests through (app pages show their own errors)
  if (!supabaseUrl || !supabaseKey) {
    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

    if (isProtected && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/wardrobe", request.url));
    }
  } catch {
    // On any auth error, redirect protected routes to login
    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|api).*)"],
};
