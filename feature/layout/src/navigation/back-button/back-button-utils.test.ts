import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { shouldUseFallbackOnBack } from "./back-button-utils"

describe("shouldUseFallbackOnBack", () => {
	it("uses fallback when there is no in-app history", () => {
		assert.equal(
			shouldUseFallbackOnBack({
				historyLength: 1,
				currentOrigin: "http://localhost:3000",
				referrer: "",
			}),
			true,
		)
	})

	it("uses fallback when the referrer is another origin", () => {
		assert.equal(
			shouldUseFallbackOnBack({
				historyLength: 3,
				currentOrigin: "http://localhost:3000",
				referrer: "https://example.com/docs",
			}),
			true,
		)
	})

	it("stays in-app when the referrer is the same origin", () => {
		assert.equal(
			shouldUseFallbackOnBack({
				historyLength: 4,
				currentOrigin: "http://localhost:3000",
				referrer: "http://localhost:3000/examples/table/basic",
			}),
			false,
		)
	})
})
