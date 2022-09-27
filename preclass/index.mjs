// UV_THREADPOOL_SIZE=1 node index.mjs 
// number 1 or 0 will set the number of cores

// because of logical CPU cores - hyperthreading, which means that each core can run 2 operations simultaneously
// some CPUs can process more talks simultaneously

import {
  execSync
} from 'node:child_process'

import {
  Worker,
} from 'node:worker_threads';

import {
  setTimeout
} from 'node:timers/promises'

function getCurrentThreadCount() {
  return parseInt(execSync(`ps -M ${process.pid} | wc -l`).toString())
}

async function createThread(data) {
  const worker = new Worker('./thread.mjs');

  const p = new Promise((resolve) => {
    worker.once('message', (message) => {
      return resolve(message)
    });
  })

  worker.postMessage(data);
  return p;
}


const nodejsDefaultThreadNumber = getCurrentThreadCount() -1 // remove the one who generated the process;
console.log(
  'Im running',
  process.pid,
  `default threads: ${nodejsDefaultThreadNumber}`
);


let nodejsThreadCount = 0
const terminalId = setInterval(
  () => {
    const totalThreads = getCurrentThreadCount() - nodejsDefaultThreadNumber
    // console.log('running every sec', new Date().toISOString())
    if (totalThreads === nodejsThreadCount) return;

    nodejsThreadCount = totalThreads;
    console.log('threads', nodejsThreadCount);
  },
)

// for (let i = 0; i < 1e10; i++);

// let p = []
// for (let i = 0; i < 20; i++) {
//   p.push(createThread({
//     from: 0,
//     to: 1e5
//   }))
// }
// await Promise.all(p)

// await setTimeout(1000);

await Promise.all([
  createThread({
    from: 0,
    to: 1e9
  }),
  createThread({
    from: 0,
    to: 1e9
  }),
  createThread({
    from: 0,
    to: 1e8
  }),
  createThread({
    from: 0,
    to: 1e3
  }),
  createThread({
    from: 0,
    to: 1e10
  })
])

clearInterval(terminalId)