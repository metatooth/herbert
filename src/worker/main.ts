import { App } from "./app";

(async () => {
  try {
    const app = new App();
    await app.init();
    await app.run();
  } catch(e) {
    console.error("------------------------")
    console.error("worker process error:", e);
    console.error("------------------------")
    process.exit(e.code)
  }
})();
