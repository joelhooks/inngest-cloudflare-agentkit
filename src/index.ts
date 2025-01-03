import dotenv from 'dotenv';
dotenv.config({ path: [ "./.dev.vars", "./.env" ] })
import { Hono } from 'hono'
import { serve } from 'inngest/hono'

import { functions, inngest } from './inngest'

type Bindings = {
  ANTHROPIC_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.on(
	['GET', 'PUT', 'POST'],
	'/api/inngest',
	serve({
		client: inngest,
		functions,
	}),
)

export default app