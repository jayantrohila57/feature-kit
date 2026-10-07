export type DemoPerson = {
	id: string
	name: string
	email: string
	status: "active" | "invited" | "disabled"
	department: string
}

export const demoPeople: DemoPerson[] = [
	{ id: "1", name: "Ada Lovelace", email: "ada@example.com", status: "active", department: "Engineering" },
	{ id: "2", name: "Grace Hopper", email: "grace@example.com", status: "active", department: "Engineering" },
	{ id: "3", name: "Katherine Johnson", email: "katherine@example.com", status: "invited", department: "Science" },
	{ id: "4", name: "Alan Turing", email: "alan@example.com", status: "active", department: "Research" },
	{ id: "5", name: "Barbara Liskov", email: "barbara@example.com", status: "disabled", department: "Engineering" },
	{ id: "6", name: "Donald Knuth", email: "don@example.com", status: "active", department: "Research" },
	{ id: "7", name: "Frances Allen", email: "frances@example.com", status: "invited", department: "Science" },
	{ id: "8", name: "Edsger Dijkstra", email: "edsger@example.com", status: "active", department: "Research" },
]

export const statusFilterOptions = [
	{ value: "active", label: "Active" },
	{ value: "invited", label: "Invited" },
	{ value: "disabled", label: "Disabled" },
]
