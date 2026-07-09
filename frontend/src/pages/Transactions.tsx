import { useState } from 'react'
import type { FormEvent } from 'react'

import { TransactionCreateForm } from '../components/transactions/TransactionCreateForm'
import { TransactionEditModal } from '../components/transactions/TransactionEditModal'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { useTransactions } from '../hooks/useTransactions'
import { useUsers } from '../hooks/useUsers'
import { updateTransaction } from '../services/api'
import type { CreateTransactionPayload, Transaction, TransactionType, UpdateTransactionPayload } from '../types/transaction'

function Transactions() {
  const { users, usersById, loading: usersLoading, error: usersError } = useUsers()
  const { transactions, loading, error, createTransaction, refreshTransactions } = useTransactions()
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<TransactionType>(0)
  const [userId, setUserId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    const payload: CreateTransactionPayload = {
      description: description.trim(),
      value: Number(value),
      type,
      date: `${date}T00:00:00`,
      userId: Number(userId),
    }

    if (!payload.description || Number.isNaN(payload.value) || Number.isNaN(payload.userId)) {
      setFormError('Preencha descrição, valor e pessoa válidos para cadastrar a transação.')
      setSubmitting(false)
      return
    }

    try {
      await createTransaction(payload)
      setDescription('')
      setValue('')
      setDate(new Date().toISOString().slice(0, 10))
      setType(0)
      setUserId('')
      await refreshTransactions()
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Não foi possível cadastrar a transação.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveEdit(payload: UpdateTransactionPayload) {
    if (!editingTransaction) {
      return
    }

    // O modal de edição reaproveita a mesma regra da API para atualizar o lançamento.
    await updateTransaction(editingTransaction.id, payload)
    await refreshTransactions()
    setEditingTransaction(null)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200/10 bg-slate-900 p-6 shadow-2xl shadow-black/10 sm:p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">Cadastro de transações</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="lg:flex-1">
            <h2 className="text-3xl font-semibold text-white sm:text-5xl">Registre receitas e despesas</h2>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <TransactionCreateForm
          description={description}
          value={value}
          date={date}
          type={type}
          userId={userId}
          users={users}
          onDescriptionChange={setDescription}
          onValueChange={setValue}
          onDateChange={setDate}
          onTypeChange={setType}
          onUserIdChange={setUserId}
          onSubmit={handleSubmit}
          submitting={submitting || usersLoading}
          error={formError || error || usersError}
        />

        <TransactionTable transactions={transactions} usersById={usersById} loading={loading} onEdit={setEditingTransaction} />
      </section>

      <TransactionEditModal
        open={Boolean(editingTransaction)}
        transaction={editingTransaction}
        users={users}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default Transactions
