import { createNetwork } from '@inngest/agent-kit'
import { anthropic } from 'inngest'

import { curmudgeonAgent } from '../agents/curmudgeon'

export const codeReviewNetwork = createNetwork({
	agents: [curmudgeonAgent],
	defaultModel: anthropic({
		model: 'claude-3-5-sonnet-latest',
		max_tokens: 8192,
		apiKey:
			process.env.ANTHROPIC_API_KEY,
	}),
	defaultRouter: ({ network, input }) => {
		if (network?.state.kv.get('done')) {
			return
		}
		return curmudgeonAgent
	},
	maxIter: 10,
})
