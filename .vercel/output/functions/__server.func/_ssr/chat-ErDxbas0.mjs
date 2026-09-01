import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-ErDxbas0.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askModel_createServerFn_handler = createServerRpc({
	id: "14f0d2feed25f22b6c4feeb9784f1bc07da5e951b0e138a6c68c3e05234c3dd7",
	name: "askModel",
	filename: "src/lib/chat.ts"
}, (opts) => askModel.__executeServer(opts));
var askModel = createServerFn({ method: "POST" }).validator((input) => input).handler(askModel_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const system = `You are ${data.persona}. You live inside Aether, a spatial multi-model canvas. Keep replies tight, concrete, and unadorned. No emoji. No marketing language. 1–3 short paragraphs unless asked for more.`;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 420,
			messages: [{
				role: "system",
				content: system
			}, ...data.messages.slice(-8)]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	return {
		ok: true,
		text: (await res.json()).choices[0]?.message.content ?? ""
	};
});
var imagineStill_createServerFn_handler = createServerRpc({
	id: "400b6391bce8c3acc16e7eea09f867dd0d2f5631646278ae36701e3c7fa98ff0",
	name: "imagineStill",
	filename: "src/lib/chat.ts"
}, (opts) => imagineStill.__executeServer(opts));
var imagineStill = createServerFn({ method: "POST" }).validator((input) => input).handler(imagineStill_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const res = await fetch("https://api.x.ai/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-imagine-image",
			prompt: data.prompt,
			n: 1,
			resolution: "1k",
			response_format: "url"
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI Imagine error ${res.status}`
	};
	return {
		ok: true,
		url: (await res.json()).data[0]?.url ?? ""
	};
});
//#endregion
export { askModel_createServerFn_handler, imagineStill_createServerFn_handler };
