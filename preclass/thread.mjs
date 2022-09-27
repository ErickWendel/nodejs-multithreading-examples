import {
  threadId,
  parentPort
} from 'node:worker_threads';

// When a message from the parent thread is received, send it back:
parentPort.once('message', (message) => {
  console.time(`benchmark-${threadId}`)
  let count = 0;
  for (let i = message.from; i < message.to; i++) { count ++ }
  console.timeEnd(`benchmark-${threadId}`)

  parentPort.postMessage(`I'm: ${threadId} done! with ${count} items`);
});