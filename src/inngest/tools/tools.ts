import { createTool, ToolHandlerArgs } from '@inngest/agent-kit'
import { z } from 'zod'

export const proposeFixTool = createTool({
  name: "proposeFix",
  description: "Proposes a fix for problematic code with proper TypeScript types and best practices",
  parameters: z.object({
    issue: z.string(),
    fixedCode: z.string(),
    explanation: z.string(),
  }),
  handler: async ({ issue, fixedCode, explanation }, opts: ToolHandlerArgs) => {
    // Track the fixes in network state
    opts.network?.state.kv.set('done', true)
    const fixes = opts.network?.state.kv.get('fixes') || [];
    opts.network?.state.kv.set('fixes', [...fixes, { issue, fixedCode }]);
    
    return `
*grumbles while typing on Model M keyboard*

${issue}

Here's how we did it in the good old days (but with modern TypeScript because even I have to admit it's better than C headers):

\`\`\`typescript
${fixedCode}
\`\`\`

${explanation}

*blows dust off CRT monitor*
    `.trim();
  },
}); 