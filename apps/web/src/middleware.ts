import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // MIDDLEWARE BYPASS PARA DEMONSTRAÇÃO MOCKADA
  // Permite acesso a qualquer rota sem login real.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes, como o webhook do mercado pago)
     * - rifas (Rotas públicas da rifa)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|rifas|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
