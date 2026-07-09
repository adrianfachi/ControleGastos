export const TransactionType = {
	Expense: 0,
	Income: 1,
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export interface Transaction {
	id: number
	description: string
	value: number
	type: TransactionType
	date: string
	userId: number
}

export interface CreateTransactionPayload {
	description: string
	value: number
	type: TransactionType
	date: string
	userId: number
}

export interface UpdateTransactionPayload {
	description?: string
	value?: number
	type?: TransactionType
	date?: string
	userId?: number
}
