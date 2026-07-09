import type { Transaction, TransactionType } from '../../types/transaction'
import type { User } from '../../types/user'

type TransactionTableProps = {
  transactions: Transaction[]
  usersById: Map<number, User>
  loading: boolean
  onEdit: (transaction: Transaction) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

function typeLabel(type: TransactionType) {
  return type === 1 ? 'Receita' : 'Despesa'
}

export function TransactionTable({ transactions, usersById, loading, onEdit }: TransactionTableProps) {
  return (
    <article className="w-full min-w-0 rounded-3xl border border-slate-200/10 bg-slate-900 p-6 shadow-xl shadow-black/10 xl:flex-1">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">Lista de transações</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Últimos lançamentos</h3>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Carregando transações...</p>
      ) : (
        <div className="max-w-full max-h-[60vh] overflow-auto rounded-2xl border border-white/10">
          <table className="w-full table-auto divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Pessoa</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/40 text-slate-100">
              {transactions.map((transaction) => {
                const currentUser = usersById.get(transaction.userId)

                return (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 font-medium">{transaction.description}</td>
                    <td className="px-4 py-3 text-slate-300">{currentUser ? currentUser.name : `Pessoa ${transaction.userId}`}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${transaction.type === 1 ? 'bg-emerald-400/15 text-emerald-200' : 'bg-rose-400/15 text-rose-200'}`}>
                        {typeLabel(transaction.type)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${transaction.type === 1 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {formatCurrency(transaction.value)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}

              {!loading && transactions.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-400" colSpan={6}>
                    Nenhuma transação cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </article>
  )
}