import type { UploaderColumn } from "uploader"

export const demoAccountUploaderColumns: UploaderColumn[] = [
	{
		key: "code",
		header: "Code",
		requiredIn: ["create", "update"],
		sample: "ACC001",
	},
	{
		key: "accountName",
		header: "Account name",
		requiredIn: ["create"],
		sample: "Operating account",
	},
	{
		key: "bankCode",
		header: "Bank code",
		requiredIn: ["create"],
		sample: "BNK001",
	},
	{
		key: "bankAccountNum",
		header: "Bank account number",
		requiredIn: ["create"],
		sample: "1234567890",
	},
	{
		key: "accountDescription",
		header: "Description",
		requiredIn: [],
		sample: "General operating account",
	},
]
