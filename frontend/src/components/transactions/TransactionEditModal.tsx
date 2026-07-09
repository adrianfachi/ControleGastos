import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { Modal } from '../common/Modal'
import type { Transaction, TransactionType, UpdateTransactionPayload } from '../../types/transaction'
import type { User } from '../../types/user'

type TransactionEditModalProps = {
  open: boolean
  transaction: Transaction | null
  users: User[]
  onClose: () => void
  onSave: (payload: UpdateTransactionPayload) => Promise<void>
}

export function TransactionEditModal({ open, transaction, users, onClose, onSave }: TransactionEditModalProps) {
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<TransactionType>(0)
  const [userId, setUserId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open || !transaction) {
      setDescription('')
      setValue('')
      setDate('')
      setType(0)
      setUserId('')
      setError(null)
      setSubmitting(false)
      return
    }

    // Recarrega o formulário quando outro lançamento entra em edição.
    setDescription(transaction.description)
    setValue(String(transaction.value))
    setDate(transaction.date.slice(0, 10))
    setType(transaction.type)
    setUserId(String(transaction.userId))
    setError(null)
    setSubmitting(false)
  }, [open, transaction])

  const selectedUser = users.find((user) => String(user.id) === userId)
  const minorBlocksIncome = Boolean(selectedUser && selectedUser.age < 18)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload: UpdateTransactionPayload = {
      description: description.trim(),
      value: Number(value),
      type,
      date: `${date}T00:00:00`,
      userId: Number(userId),
    }

    if (!payload.description || Number.isNaN(payload.value) || Number.isNaN(payload.userId)) {
      setError('Informe descrição, valor e pessoa válidos para atualizar a transação.')
      setSubmitting(false)
      return
    }

    if (selectedUser && selectedUser.age < 18 && payload.type === 1) {
      setError('Menores de idade não podem cadastrar receitas.')
      setSubmitting(false)
      return
    }

    try {
      await onSave(payload)
      onClose()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível atualizar a transação.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title={transaction ? `Editar transação #${transaction.id}` : 'Editar transação'} description="A alteração respeita a mesma regra de menor de idade usada no cadastro." onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Descrição</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
          />
        </label>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Valor</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Data</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/70"
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Tipo</span>
            <select
              value={type}
              onChange={(event) => setType(Number(event.target.value) as TransactionType)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-300/70"
            >
              <option value={0}>Despesa</option>
              <option value={1} disabled={minorBlocksIncome}>
                Receita
              </option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Pessoa</span>
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
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

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Salvando...' : 'Atualizar transação'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-400/20 bg-slate-800 px-5 py-3 font-semibold text-slate-100 transition hover:bg-slate-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  )
}