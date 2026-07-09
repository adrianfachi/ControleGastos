import type { User } from '../../types/user'

type UserTableProps = {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onDelete: (userId: number) => void
}

export function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
  return (
    <section className="rounded-3xl border border-slate-200/10 bg-slate-900 p-6 shadow-xl shadow-black/10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">Lista de pessoas</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Cadastros atuais</h3>
        </div>
        <span className="text-sm text-slate-400">{loading ? 'Atualizando...' : `${users.length} registros`}</span>
      </div>

      <div className="max-w-full max-h-[60vh] overflow-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Id</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Idade</th>
              <th className="px-4 py-3 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/40 text-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-slate-400">{user.id}</td>
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.age}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && users.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-400" colSpan={4}>
                  Nenhuma pessoa cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}