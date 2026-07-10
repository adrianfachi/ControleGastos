import axios, { AxiosError } from 'axios'

import type { CreateTransactionPayload, Transaction, UpdateTransactionPayload } from '../types/transaction'
import type { CreateUserPayload, UpdateUserPayload, User } from '../types/user'
import type { TotalsResponse } from '../types/totals'

/**
 * Cliente único de integração com a API.
 *
 * A baseURL aponta para /api porque o Vite faz o proxy até o backend ASP.NET
 * durante o desenvolvimento. Isso mantém a UI simples e evita problemas de CORS.
 */
const api = axios.create({
	baseURL: 'https://controlegastos-o295.onrender.com/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

type BackendErrorBody = {
	message?: string
	title?: string
	detail?: string
	traceId?: string
	errors?: Record<string, unknown>
}

function formatBackendResponse(data: unknown) {
	// Normaliza a resposta bruta do backend para virar uma mensagem legível na tela.
	if (!data) {
		return ''
	}

	if (typeof data === 'string') {
		return data
	}

	if (typeof data === 'object') {
		const body = data as BackendErrorBody & Record<string, unknown>
		const parts = [body.message, body.title, body.detail]
			.filter((part) => typeof part === 'string' && part.trim().length > 0)
			.map((part) => String(part).trim())

		if (parts.length > 0) {
			return parts.join(' | ')
		}

		if (body.errors && typeof body.errors === 'object') {
			return Object.entries(body.errors)
				.map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
				.join(' | ')
		}

		return JSON.stringify(data)
	}

	return String(data)
}

function extractErrorMessage(error: unknown) {
	// Converte erros do Axios em texto curto com status e resposta do servidor.
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError<BackendErrorBody>
		const status = axiosError.response?.status
		const backendResponse = formatBackendResponse(axiosError.response?.data)

		if (status) {
			return backendResponse
				? `Backend ${status}: ${backendResponse}`
				: `Backend ${status}`
		}

		return backendResponse || 'Não foi possível concluir a operação.'
	}

	return 'Não foi possível concluir a operação.'
}

async function request<T>(promise: Promise<{ data: T }>) {
	// Helper único para evitar repetir o mesmo tratamento de erro em todas as chamadas.
	try {
		const response = await promise
		return response.data
	} catch (error) {
		throw new Error(extractErrorMessage(error))
	}
}

export async function listUsers() {
	return request(api.get<User[]>('/User'))
}

export async function createUser(payload: CreateUserPayload) {
	return request(api.post('/User', payload))
}

export async function updateUser(userId: number, payload: UpdateUserPayload) {
	return request(api.patch(`/User/${userId}`, payload))
}

export async function deleteUser(userId: number) {
	await request(api.delete(`/User/${userId}`))
}

export async function listTransactions() {
	return request(api.get<Transaction[]>('/Transaction'))
}

export async function createTransaction(payload: CreateTransactionPayload) {
	return request(api.post('/Transaction', payload))
}

export async function updateTransaction(transactionId: number, payload: UpdateTransactionPayload) {
	return request(api.patch(`/Transaction/${transactionId}`, payload))
}

export async function deleteTransaction(transactionId: number) {
	await request(api.delete(`/Transaction/${transactionId}`))
}

export async function getTotals() {
	return request(api.get<TotalsResponse>('/User/totals'))
}

export { extractErrorMessage }
