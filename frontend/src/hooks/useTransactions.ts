import { useCallback, useEffect, useState } from 'react'

import { createTransaction, deleteTransaction, extractErrorMessage, listTransactions } from '../services/api'
import type { CreateTransactionPayload, Transaction } from '../types/transaction'

/**
 * Gerencia a lista de transações e as ações permitidas no desafio.
 * A exclusão não é exposta na UI, mas fica disponível para manter a camada consistente com o backend.
 */
export function useTransactions() {
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const refreshTransactions = useCallback(async () => {
		// Busca os lançamentos mais recentes sempre que a tela precisa atualizar.
		setLoading(true)
		setError(null)

		try {
			const data = await listTransactions()
			setTransactions(data)
		} catch (requestError) {
			setError(extractErrorMessage(requestError))
		} finally {
			setLoading(false)
		}
	}, [])

	const handleCreateTransaction = useCallback(async (payload: CreateTransactionPayload) => {
		await createTransaction(payload)
		await refreshTransactions()
	}, [refreshTransactions])

	const handleDeleteTransaction = useCallback(async (transactionId: number) => {
		await deleteTransaction(transactionId)
		await refreshTransactions()
	}, [refreshTransactions])

	useEffect(() => {
		void refreshTransactions()
	}, [refreshTransactions])

	return {
		transactions,
		loading,
		error,
		refreshTransactions,
		createTransaction: handleCreateTransaction,
		deleteTransaction: handleDeleteTransaction,
	}
}
