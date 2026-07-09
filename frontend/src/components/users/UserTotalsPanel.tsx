import type { TotalsResponse } from '../../types/totals'

type UserTotalsPanelProps = {
  totals: TotalsResponse | null
  loading: boolean
  error: string | null
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function UserTotalsPanel({ totals, loading, error }: UserTotalsPanelProps) {
  return (
    <article className="rounded-3xl border border-slate-200/10 bg-slate-900 p-6 shadow-xl shadow-black/10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">Consulta de totais</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Resumo por pessoa</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">Receita - despesa</span>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Carregando totais...</p>
      ) : error ? (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Total receitas</p>
              <strong className="mt-2 block text-xl text-emerald-200">{totals ? formatCurrency(totals.totalIncome) : '—'}</strong>
            </div>
            <div className="rounded-2xl border border-rose-400/15 bg-rose-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70">Total despesas</p>
              <strong className="mt-2 block text-xl text-rose-200">{totals ? formatCurrency(totals.totalExpense) : '—'}</strong>
            </div>
            <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">Saldo líquido</p>
              <strong className="mt-2 block text-xl text-amber-100">{totals ? formatCurrency(totals.balance) : '—'}</strong>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Pessoa</th>
                  <th className="px-4 py-3 font-medium">Idade</th>
                  <th className="px-4 py-3 font-medium">Receitas</th>
                  <th className="px-4 py-3 font-medium">Despesas</th>
                  <th className="px-4 py-3 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/40 text-slate-100">
                {(totals?.users ?? []).map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.age}</td>
                    <td className="px-4 py-3 text-emerald-300">{formatCurrency(user.totalIncome)}</td>
                    <td className="px-4 py-3 text-rose-300">{formatCurrency(user.totalExpense)}</td>
                    <td className={`px-4 py-3 font-semibold ${user.balance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {formatCurrency(user.balance)}
                    </td>
                  </tr>
                ))}
                {!loading && (totals?.users ?? []).length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-400" colSpan={5}>
                      Nenhuma pessoa cadastrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </article>
  )
}