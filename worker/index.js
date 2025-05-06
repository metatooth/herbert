import { App } from './worker/app.js'

console.log('=== Starting Herbert Worker ===')

const app = new App()
await app.init()
await app.run()
