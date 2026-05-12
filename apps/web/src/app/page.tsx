import Link from "next/link";
import { 
  ArrowRight, 
  Smartphone, 
  ShieldCheck, 
  Trophy, 
  Users, 
  Activity, 
  Store, 
  BarChart3, 
  Camera, 
  CheckCircle2,
  Play
} from "lucide-react";
import { BoxingGlove } from "@/components/icons/BoxingGlove";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500 selection:text-black font-sans overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-xl">
              <BoxingGlove className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-black tracking-widest uppercase">Fight Hub</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#funcionalidades" className="hover:text-white transition-colors">Ecossistema</a>
            <a href="#app" className="hover:text-white transition-colors">App do Aluno</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/admin" className="bg-yellow-500 text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              Ver Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 font-bold text-xs uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            O Futuro das Academias de Luta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Não venda apenas treinos.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Venda pertencimento.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            O primeiro ERP verticalizado do mundo desenhado exclusivamente para academias de artes marciais. Da catraca biométrica à gamificação de faixas, centralizamos toda a sua operação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admin" className="w-full sm:w-auto bg-yellow-500 text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              Explorar Plataforma <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/aluno" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Smartphone className="h-5 w-5" /> Visão do Aluno
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="max-w-6xl mx-auto mt-20 relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="rounded-[24px] md:rounded-[40px] border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl shadow-2xl p-2 md:p-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
            <img 
              src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop" 
              alt="Plataforma Fight Hub" 
              className="rounded-[16px] md:rounded-[32px] w-full object-cover aspect-[16/9] opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href="/admin" className="h-20 w-20 rounded-full bg-yellow-500/90 text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                <Play className="h-8 w-8 ml-1" fill="currentColor" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID: FUNCIONALIDADES */}
      <section id="solucoes" className="py-24 px-6 bg-black relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Um Ecossistema <span className="text-yellow-500">Completo</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Tudo que sua academia precisa para crescer, reter alunos e automatizar o faturamento em uma única tela.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">
            
            {/* Box 1: Gamificação */}
            <Link href="/aluno/evolucao" className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-[#0A0A0A] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
              <Trophy className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Gamificação e Faixas</h3>
              <p className="text-zinc-400">Sistema automático de XP, badges, histórico de exames e elegibilidade de graduação. O aluno vicia em evoluir.</p>
              <div className="absolute bottom-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                <ArrowRight className="h-8 w-8 text-yellow-500" />
              </div>
            </Link>

            {/* Box 2: IA de Churn */}
            <Link href="/admin/relatorios" className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-red-950/20 to-black border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-red-500/30 transition-colors">
              <Activity className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">IA de Retenção (Churn)</h3>
              <p className="text-zinc-400">Algoritmo detecta quando o aluno está perdendo o engajamento e alerta para você agir antes dele cancelar a matrícula.</p>
              <AlertMock />
            </Link>

            {/* Box 3: Financeiro */}
            <Link href="/admin/financeiro" className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-emerald-950/20 to-black border border-white/5 rounded-[32px] p-8 relative hover:border-emerald-500/30 transition-colors flex flex-col justify-between">
              <div>
                <BarChart3 className="h-8 w-8 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">ERP Financeiro</h3>
                <p className="text-sm text-zinc-400">Gestão de MRR, cobrança via PIX e boletos automáticos.</p>
              </div>
            </Link>

            {/* Box 4: Loja */}
            <Link href="/admin/loja" className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-950/20 to-black border border-white/5 rounded-[32px] p-8 relative hover:border-blue-500/30 transition-colors flex flex-col justify-between">
              <div>
                <Store className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Loja & Marketplace</h3>
                <p className="text-sm text-zinc-400">Venda kimonos, luvas e suplementos direto no app do aluno.</p>
              </div>
            </Link>

            {/* Box 5: Catraca/QR */}
            <Link href="/admin/scanner" className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <Camera className="h-10 w-10 text-zinc-300 mb-4 relative z-10" />
              <h3 className="text-2xl font-bold mb-2 relative z-10">Recepção Biométrica</h3>
              <p className="text-zinc-400 relative z-10 max-w-sm">Diga adeus às roletas antigas. Use um tablet na parede para check-in via QR Code ou Reconhecimento Facial integrado ao sistema de mensalidades.</p>
            </Link>

          </div>
        </div>
      </section>

      {/* OS 4 PILARES */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-10">
              <h2 className="text-4xl font-black leading-tight">Uma plataforma,<br/><span className="text-yellow-500">Quatro portais exclusivos.</span></h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Portal do Administrador</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Controle financeiro total, gestão de planos, visualização de inadimplência, loja virtual, CRM de vendas e dashboard com inteligência artificial para evasão.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Portal do Professor</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Na beira do tatame: lista de chamada no celular, aprovação de graduações, feedback de atletas e histórico de desempenho em campeonatos.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Smartphone className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">App do Aluno</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Grade de aulas, check-in, evolução de faixas, gamificação (XP), rede social interna da academia, pagamento integrado e loja virtual.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Área do Responsável</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">Conta Família. Os pais acompanham a frequência, comportamento, evolução técnica das crianças e pagam todas as mensalidades em um clique.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[40px] overflow-hidden flex items-center justify-center p-8 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent opacity-50" />
              
              {/* Fake Mobile App Interface */}
              <div className="w-[300px] h-[600px] bg-black border-8 border-zinc-800 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
                <div className="h-6 bg-black w-full flex justify-center pt-2 relative z-20">
                  <div className="w-20 h-4 bg-zinc-800 rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 relative z-10 bg-[#0A0A0A]">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Nível 4</p>
                      <h4 className="font-bold text-lg">Faixa Branca</h4>
                    </div>
                    <div className="h-10 w-10 bg-zinc-900 rounded-full flex items-center justify-center border border-yellow-500/30">
                      <span className="text-lg">🔥</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-2xl p-4 mb-4 border border-white/5">
                    <p className="text-xs text-zinc-500 mb-2">Próxima Aula</p>
                    <p className="font-bold">Jiu Jitsu - Fundamentos</p>
                    <p className="text-emerald-500 text-xs font-bold mt-1">Hoje às 19:00</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-zinc-900 rounded-2xl p-4 border border-white/5 text-center">
                      <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                      <p className="text-xs font-bold">1.2k XP</p>
                    </div>
                    <div className="bg-zinc-900 rounded-2xl p-4 border border-white/5 text-center">
                      <CheckCircle2 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-xs font-bold">8 Aulas</p>
                    </div>
                  </div>
                  <div className="w-full h-32 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center">
                    <p className="text-xs font-bold text-zinc-500">QR Code de Acesso</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight">
            Pronto para dominar seu tatame?
          </h2>
          <p className="text-xl text-black/80 font-medium mb-10 max-w-2xl mx-auto">
            Pare de usar planilhas e softwares genéricos de musculação. Mude hoje para o sistema feito para a cultura da luta.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/admin" className="bg-black text-white px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-2xl uppercase tracking-wider">
              Acessar Painel Admin
            </Link>
            <Link href="/aluno" className="bg-white/20 border-2 border-black/20 text-black px-10 py-5 rounded-full font-black text-lg hover:bg-black hover:text-yellow-500 transition-colors uppercase tracking-wider">
              Testar App do Aluno
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-10 border-t border-white/10 text-center text-zinc-600 text-sm">
        <p>© 2026 Fight Hub Plataform. Construído para campeões.</p>
      </footer>
    </div>
  );
}

// Pequeno componente visual para injetar no Bento Grid
function AlertMock() {
  return (
    <div className="absolute -bottom-2 -right-2 bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 transform rotate-[-5deg] shadow-2xl">
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"><Activity className="h-4 w-4 text-white"/></div>
      <div>
        <p className="text-xs font-bold text-white">Alerta Evasão</p>
        <p className="text-[10px] text-red-200">João sumiu há 14 dias</p>
      </div>
    </div>
  )
}
