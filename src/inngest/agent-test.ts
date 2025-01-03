import { State } from '@inngest/agent-kit'
import { inngest } from './inngest-client'
import { codeReviewNetwork } from './networks/code-review-network'

const sampleCode = `
// Why use TypeScript when we have any?
type Config = any;

// Global state AND event emitter, what could go wrong?
const eventBus = new EventEmitter();
let globalCache: any = {};
let isProcessing = false;

// Singleton pattern because that's enterprise™
class DataProcessor {
  private static instance: DataProcessor;
  
  private constructor() {
    // Subscribe to events with arrow functions, memory leaks FTW
    eventBus.on('data', (data) => this.processData(data));
    eventBus.on('error', data => console.log('oops:', data));
  }

  public static getInstance() {
    if (!DataProcessor.instance) {
      DataProcessor.instance = new DataProcessor();
    }
    return DataProcessor.instance;
  }

  // Mixed sync/async with no error boundaries
  async processData(data) {
    // Race condition? Never heard of it
    if(isProcessing) return;
    isProcessing = true;
    
    try {
      // Fetch without AbortController, let it hang forever
      const config = await fetch('/api/config')
      let results = []
      
      // Nested loops with mixed types and loose equality
      for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].items?.length; j++) {
          if(data[i].items[j].active == true) {
            if(data[i].items[j].type === 'special') {
              let tmp = data[i].items[j]
              // Memory leak? More like memory feature
              globalCache[tmp.id] = tmp
              tmp.processed = true
              results.push(tmp)
              
              // Nested promises without error handling
              this.updateMetrics(tmp).then(() => {
                this.notify(tmp).catch(console.log)
              })
            }
          }
        }
      }
      
      return results
    } finally {
      // Race condition part 2: Electric Boogaloo
      setTimeout(() => {
        isProcessing = false
      }, 100)
    }
  }

  private async updateMetrics(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        globalCache.lastUpdate = Date.now()
        resolve(true)
      }, Math.random() * 1000) // Random delays for extra fun
    })
  }

  private async notify(data) {
    // Error swallowing like a boss
    try {
      await fetch('/api/notify', { 
        method: 'POST',
        body: JSON.stringify(data)
      })
    } catch {}
  }
}

// Export the singleton instance because why not
export default DataProcessor.getInstance();
`

export const agentTest = inngest.createFunction(
	{ id: 'agent-test' },
	{ event: 'demo/event.sent' },
	async (opts) => {



		const state = new State()

		// Set some initial state
		state.kv.set('codeToReview', sampleCode)
		state.kv.set('context', {
			language: 'TypeScript',
			purpose: 'Enterprise Data Processing™',
			expectations: 'Production-ready code'
		})

		const result = await codeReviewNetwork.run(
				`Review this enterprise-grade code for best practices, type safety, and performance:
				
				${sampleCode}`,
				{ state }
			)

		// Get the feedback from state
		const feedback = state.kv.get('feedback')
		const isDone = state.kv.get('done')

		return {
			message: 'Code Review Complete',
			isDone,
			feedback,
			result
		}
	}
)
