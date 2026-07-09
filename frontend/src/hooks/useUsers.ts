import { useCallback, useEffect, useMemo, useState } from 'react'

import { createUser, deleteUser, extractErrorMessage, listUsers } from '../services/api'
import type { CreateUserPayload, User } from '../types/user'

/**
 * Centraliza o cadastro de pessoas no frontend.
 * A tela usa este hook para listar, criar e excluir pessoas sem duplicar lógica de requisição.
 */
export function useUsers() {
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const refreshUsers = useCallback(async () => {
		// Recarrega a lista da API e mantém o estado da tela sincronizado.
		setLoading(true)
		setError(null)

		try {
			const data = await listUsers()
			setUsers(data)
		} catch (requestError) {
			setError(extractErrorMessage(requestError))
		} finally {
			setLoading(false)
		}
	}, [])

	// Facilita a busca por pessoa sem precisar varrer o array em vários lugares.
	const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])

	const handleCreateUser = useCallback(async (payload: CreateUserPayload) => {
		await createUser(payload)
		await refreshUsers()
	}, [refreshUsers])

	const handleDeleteUser = useCallback(async (userId: number) => {
		await deleteUser(userId)
		await refreshUsers()
	}, [refreshUsers])

	useEffect(() => {
		void refreshUsers()
	}, [refreshUsers])

	return {
		users,
		usersById,
		loading,
		error,
		refreshUsers,
		createUser: handleCreateUser,
		deleteUser: handleDeleteUser,
	}
}
