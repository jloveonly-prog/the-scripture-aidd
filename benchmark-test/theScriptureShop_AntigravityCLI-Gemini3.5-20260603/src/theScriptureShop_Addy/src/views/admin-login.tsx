interface AdminLoginProps {
  error?: string;
}

export const AdminLogin = ({ error }: AdminLoginProps) => {
  return (
    <div class="mx-auto max-w-md px-4 py-20">
      <div class="glass-panel rounded-2xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 class="font-display text-2xl font-extrabold text-slate-100">관리자 로그인</h1>
          <p class="text-xs text-slate-450 mt-1">도서 주문 처리 및 송장 관리를 위해 로그인하세요.</p>
        </div>

        {error && (
          <div class="bg-rose-950/45 border border-rose-800/40 rounded-xl p-3.5 text-xs text-rose-350 mb-6">
            ⚠️ {error}
          </div>
        )}

        <form method="post" action="/admin/login" class="space-y-5">
          <div>
            <label for="username" class="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">사용자명 (Username)</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              required
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label for="password" class="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">비밀번호 (Password)</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required
              class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/10 text-sm mt-6"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};
