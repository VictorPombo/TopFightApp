import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: Precisamos chamar getUser para atualizar a sessão
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verifica se a rota começa com /admin ou /aluno
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAlunoRoute = request.nextUrl.pathname.startsWith("/aluno");

  if (isAdminRoute || isAlunoRoute) {
    if (!user) {
      // Se não estiver logado, redireciona para o login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Busca a role do usuário no banco (Executa no Edge runtime sem problemas com Supabase)
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = userData?.role || "aluno"; // Fallback para aluno

    if (isAdminRoute && role === "aluno") {
      // Aluno tentando acessar admin: joga pro portal dele
      const url = request.nextUrl.clone();
      url.pathname = "/aluno";
      return NextResponse.redirect(url);
    }

    if (isAlunoRoute && (role === "admin" || role === "professor")) {
      // Admin/Professor tentando acessar aluno: joga pro admin
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  // Se o usuário estiver logado e tentar acessar /login ou /, manda para o lugar certo
  if ((request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname === "/") && user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = userData?.role || "aluno";
    const url = request.nextUrl.clone();
    url.pathname = role === "aluno" ? "/aluno" : "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
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
