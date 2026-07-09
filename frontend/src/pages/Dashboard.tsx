import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { UserCreateForm } from '../components/users/UserCreateForm'
import { UserEditModal } from '../components/users/UserEditModal'
import { UserTable } from '../components/users/UserTable'
import { UserTotalsPanel } from '../components/users/UserTotalsPanel'
import { updateUser } from '../services/api'
import { useTotals } from '../hooks/useTotals'
import { useUsers } from '../hooks/useUsers'
import type { CreateUserPayload, UpdateUserPayload, User } from '../types/user'

function Dashboard() {
  const { users, loading, error, createUser, deleteUser, refreshUsers } = useUsers()
  const { totals, loading: totalsLoading, error: totalsError, refreshTotals } = useTotals()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    // Sempre recalcula os totais quando a lista de pessoas muda.
    void refreshTotals()
  }, [refreshTotals, users])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    const payload: CreateUserPayload = {
      name: name.trim(),
      age: Number(age),
    }

    if (!payload.name || Number.isNaN(payload.age)) {
      setFormError('Informe nome e idade válidos para cadastrar a pessoa.')
      setSubmitting(false)
      return
    }

    try {
      await createUser(payload)
      setName('')
      setAge('')
      await refreshUsers()
      await refreshTotals()
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Não foi possível cadastrar a pessoa.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(userId: number) {
    // A exclusão remove a pessoa e as transações ligadas a ela no backend.
    const confirmed = window.confirm('Ao excluir esta pessoa, todas as transações associadas serão removidas. Continuar?')

    if (!confirmed) {
      return
    }

    try {
      await deleteUser(userId)
      await refreshUsers()
      await refreshTotals()
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Não foi possível excluir a pessoa.')
    }
  }

  async function handleSaveEdit(payload: UpdateUserPayload) {
    if (!editingUser) {
      return
    }

    // A edição abre um modal separado para evitar quebrar o fluxo de cadastro.
    await updateUser(editingUser.id, payload)
    await refreshUsers()
    await refreshTotals()
    setEditingUser(null)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200/10 bg-slate-900 p-6 shadow-2xl shadow-black/10 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
          <div className="space-y-4 lg:flex-1">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">Visão geral</p>
            <h2 className="max-w-2xl text-3xl font-semibold text-white sm:text-5xl">Controle as pessoas</h2>
          </div>

          <div className="flex min-w-max flex-col gap-3 sm:flex-row">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pessoas</p>
              <strong className="mt-3 block text-3xl text-white">{users.length}</strong>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Receitas</p>
              <strong className="mt-3 block text-2xl text-emerald-300">{totals ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.totalIncome) : '—'}</strong>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Saldo</p>
              <strong className="mt-3 block text-2xl text-amber-200">{totals ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.balance) : '—'}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 xl:flex-row">
        <UserCreateForm
          name={name}
          age={age}
          onNameChange={setName}
          onAgeChange={setAge}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={formError || error}
        />

        <UserTotalsPanel totals={totals} loading={totalsLoading} error={totalsError} />
      </section>

      <UserTable users={users} loading={loading} onEdit={setEditingUser} onDelete={handleDelete} />

      <UserEditModal
        open={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default Dashboard
