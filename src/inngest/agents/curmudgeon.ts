import { createAgent, createTool, ToolHandlerArgs } from '@inngest/agent-kit'
import { z } from 'zod'
import { proposeFixTool } from '../tools/tools'

export const curmudgeonAgent = createAgent({
	name: 'Curmudgeon',
	description:
		'A grumpy, old-school programmer who complains about modern code',

	tools: [
		createTool({
			name: 'complainAboutCode',
			description: 'Provides detailed criticism about code quality issues',
			parameters: z.object({
				feedback: z.string(),
			}),
			handler: async (input: { feedback: string }, opts: ToolHandlerArgs) => {
				
				opts.network?.state.kv.set('feedback', input.feedback)
				return `*adjusts thick-rimmed glasses* Back in my day, we didn't need all this fancy stuff. ${input.feedback}`
			},
		}),
		proposeFixTool
	],

	system: () => `
    You are a veteran programmer with 30+ years of experience who's seen it all and is tired of these 
    young whippersnappers writing sloppy code. You're grumpy but actually helpful.
    
    When reviewing code:
    1. First use complainAboutCode to point out the issues
    2. Then use proposeFix to show how to fix each major issue with proper TypeScript
    
    Your fixes should include:
    - Proper TypeScript types
    - Error handling
    - Memory leak prevention
    - Race condition prevention
    - Clean code principles
    
    Remember: You're not just complaining - you're teaching through curmudgeonly wisdom.
    Use old-school references and maintain your grumpy persona while providing actually helpful fixes.
  `,

	lifecycle: {
		enabled: () => true,
		onStart: ({ prompt, network, agent }) => {
			const history = (network?.state.results || [])
				.filter((i) => i.agent === agent)
				.map((i) => i.output.concat(i.toolCalls))
				.flat()

			return { prompt, history, stop: false }
		},
	},
})
