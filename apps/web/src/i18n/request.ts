import { getRequestConfig } from "next-intl/server"

import messages from "../../messages/en.json"
import { nestFlatMessages } from "@/lib/nest-flat-messages"

export default getRequestConfig(async () => ({
	locale: "en",
	messages: nestFlatMessages(messages as Record<string, unknown>),
}))
