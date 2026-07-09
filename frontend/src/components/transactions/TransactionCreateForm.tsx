import type { FormEvent } from 'react'

import type { TransactionType } from '../../types/transaction'
import type { User } from '../../types/user'

type TransactionCreateFormProps = {
  description: string
  value: string
  date: string
  type: TransactionType
  userId: string
  users: User[]
  onDescriptionChange: (value: string) => void
  onValueChange: (value: string) => void
  onDateChange: (value: string) => void
  onTypeChange: (value: TransactionType) => void
  onUserIdChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitting: boolean
  error: string | null
}

export function TransactionCreateForm({
  description,
  value,
  date,
  type,
  userId,
  users,
  onDescriptionChange,
  onValueChange,
  onDateChange,
  onTypeChange,
  onUserIdChange,
  onSubmit,
  submitting,
  error,
}: TransactionCreateFormProps) {
  const selectedUser = users.find((user) => String(user.id) === userId)
  const minorBlocksIncome = Boolean(selectedUser && selectedUser.age < 18)

  return (
    <article className="w-full min-w-0 rounded-3xl border border-slate-200/10 bg-slate-900 p-6 shadow-xl shadow-black/10 xl:w-[34rem] xl:max-w-[34rem] xl:flex-none">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">Nova transação</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">Lançamento financeiro</h3>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Descrição</span>
          <input
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
            placeholder="Ex.: compra do mercado"
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="block flex-1 min-w-0 space-y-2">
            <span className="text-sm text-slate-300">Valor</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
              placeholder="0,00"
            />
          </label>

          <label className="block flex-1 min-w-0 space-y-2">
            <span className="text-sm text-slate-300">Data</span>
            <input
              type="date"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/70"
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="block flex-1 min-w-0 space-y-2">
            <span className="text-sm text-slate-300">Tipo</span>
            <select
              value={type}
              onChange={(event) => onTypeChange(Number(event.target.value) as TransactionType)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/70"
            >
              <option value={0}>Despesa</option>
              <option value={1} disabled={minorBlocksIncome}>
                Receita
              </option>
            </select>
          </label>

          <label className="block flex-1 min-w-0 space-y-2">
            <span className="text-sm text-slate-300">Pessoa</span>
            <select
              value={userId}
              onChange={(event) => onUserIdChange(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/70"
            >
              <option value="">Selecione</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.age < 18 ? '(menor)' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : 'Cadastrar transação'}
        </button>
      </form>
    </article>
  )
}