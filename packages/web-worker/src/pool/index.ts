/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { uuid, withResolvers } from '../utils';

type PoolOptions = {
  size: number;
};

type WorkerPoolWorker = {
  id: string;
  instance: Worker;
  state: 'idle' | 'busy' | 'error' | 'terminated';
  ready: boolean;
};

type WorkerFunction = (args: { id: string }) => Worker;

export class WorkerPool {
  private workers = new Map();
  private pendingTasks = new Map();
  private queuedTasks = [];
  private initialized = false;
  private workerFn;
  private options;

  constructor(workerFn: WorkerFunction, options: PoolOptions) {
    this.options = {
      size: options.size ?? 4,
    };

    this.workerFn = workerFn;
  }

  private createWorker() {
    const id = uuid();
    const instance = this.workerFn({ id });

    const worker = {
      id,
      instance,
      ready: false,
      state: 'idle' as WorkerPoolWorker['state'],
    };

    worker.instance.onmessage = (e: MessageEvent) => {
      this.onMessage(e, worker);
    };

    this.workers.set(id, worker);

    return worker;
  }

  private onMessage(e: MessageEvent, worker: WorkerPoolWorker) {
    const message = e.data;
    const { id, type, payload } = message;

    switch (type) {
      case 'ready': {
        worker.ready = true;
        worker.state = 'idle';

        break;
      }

      case 'result': {
        const task = this.pendingTasks.get(id);

        if (task) {
          this.pendingTasks.delete(id);
          worker.state = 'idle';
          task.resolvers.resolve(payload.data);
        }

        break;
      }

      case 'error': {
        const task = this.pendingTasks.get(id);

        if (task) {
          this.pendingTasks.delete(id);
          worker.state = 'error';
        }

        break;
      }

      case 'progress': {
        break;
      }
    }
  }

  private initialize() {
    if (this.initialized) {
      return;
    }

    for (let i = 0; i < this.options.size; i++) {
      this.createWorker();
    }

    this.initialized = true;
  }

  private processQueue() {
    if (this.queuedTasks.length === 0) {
      return;
    }

    let idleWorker!: WorkerPoolWorker;

    for (const worker of this.workers.values()) {
      if (worker.state === 'idle') {
        idleWorker = worker;
        break;
      }
    }

    if (!idleWorker) {
      return;
    }

    const task = this.queuedTasks.shift();

    if (!task) {
      return;
    }

    this.execute(idleWorker, task);

    if (this.queuedTasks.length > 0) {
      this.processQueue();
    }
  }

  private execute(worker: WorkerPoolWorker, task: any) {
    worker.state = 'busy';

    this.pendingTasks.set(task.id, task);

    const message = {
      id: task.id,
      type: 'execute',
      payload: {
        fn: task.fn,
        args: task.args,
      },
      timestamp: Date.now(),
    };

    worker.instance.postMessage(message);
  }

  run<In, Out>(fnName: string, args: In): Promise<Out> {
    if (!this.initialized) {
      this.initialize();
    }

    const id = uuid();
    const resolvers = withResolvers<Out>();

    const task = {
      id,
      fn: fnName,
      args,
      resolvers,
    };

    // @ts-expect-error fixme
    this.queuedTasks.push(task);
    this.processQueue();

    return resolvers.promise;
  }

  terminate() {
    // todo
  }
}
