import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { Modal } from '../common/Modal'
import type { UpdateUserPayload, User } from '../../types/user'

type UserEditModalProps = {
  open: boolean
  user: User | null
  onClose: () => void
  onSave: (payload: UpdateUserPayload) => Promise<void>
}

export function UserEditModal({ open, user, onClose, onSave }: UserEditModalProps) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open || !user) {
      setName('')
      setAge('')
      setError(null)
      setSubmitting(false)
      return
    }

    // Sincroniza os campos quando outro registro entra em edição.
    setName(user.name)
    setAge(String(user.age))
    setError(null)
    setSubmitting(false)
  }, [open, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload: UpdateUserPayload = {
      name: name.trim(),
      age: Number(age),
    }

    if (!payload.name || Number.isNaN(payload.age)) {
      setError('Informe nome e idade válidos para atualizar a pessoa.')
      setSubmitting(false)
      return
    }

    try {
      await onSave(payload)
      onClose()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível atualizar a pessoa.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title={user ? `Editar pessoa #${user.id}` : 'Editar pessoa'} description="Atualize os dados sem sair da listagem." onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Nome</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Idade</span>
          <input
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70"
          />
        </label>

        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Salvando...' : 'Atualizar pessoa'}
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