# Inngest Wrangler AgentKit

A Cloudflare Worker using Inngest's AgentKit to run a grumpy code review agent powered by Claude.

## Features

- Curmudgeon Agent: A grumpy but helpful code reviewer
- TypeScript-first implementation
- Runs on Cloudflare Workers via Inngest
- Uses Claude 3 Sonnet for AI capabilities

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up your environment:
```bash
# Development
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Development

```bash
# Run the dev server
pnpm run dev

# In another terminal, run Inngest dev server
pnpm run dev:inngest
```

## Deployment

**Important**: This project uses a wrapper around `wrangler` to enable `process.env` support, which is required for AgentKit to access external APIs.

Deploy using:
```bash
npx wangler deploy --penv ANTHROPIC_API_KEY=sk-ant-api03-...
```

Note: Always use `wangler` (not `wrangler`) for deployments to ensure environment variables are properly handled.

## Testing the Agent

The agent responds to the `demo/event.sent` event. You can trigger it using the Inngest dev server or via API:

```typescript
await inngest.send({
  name: "demo/event.sent",
  data: {
    // Your code to review
  }
});
```

## Environment Variables

Required variables for deployment:
- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude

## Development Notes

- Uses `wangler` wrapper for proper env handling
- Configured for TypeScript and ESM
- Includes Prettier for code formatting
- Built on Cloudflare Workers platform

## License

MIT