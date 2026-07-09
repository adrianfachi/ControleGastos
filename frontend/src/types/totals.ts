export interface UserTotal {
	id: number
	name: string
	age: number
	totalIncome: number
	totalExpense: number
	balance: number
}

export interface TotalsResponse {
	users: UserTotal[]
	totalIncome: number
	totalExpense: number
	balance: number
}
