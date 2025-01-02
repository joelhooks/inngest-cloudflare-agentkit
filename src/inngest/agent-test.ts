import { inngest } from "./inngest-client"

export const agentTest  = inngest.createFunction({id: "agent-test"}, {event: "demo/event.sent"}, async ({event, step}) => {
    return {
        message: `Hello ${event.name}!`
    }
})