export interface User {
	id: number
	name: string
	age: number
}

export interface CreateUserPayload {
	name: string
	age: number
}

export interface UpdateUserPayload {
	name?: string
	age?: number
}
