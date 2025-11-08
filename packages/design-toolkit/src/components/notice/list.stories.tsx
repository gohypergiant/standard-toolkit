/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useBus, useEmit } from '@accelint/bus/react';
import { type UniqueId, uuid } from '@accelint/core';
import { useEffect, useState } from 'react';
import { Button } from '../button';
import { NoticeEventTypes } from './events';
import { NoticeList } from './list';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  NoticeActionEvent,
  NoticeContent,
  NoticeDequeueEvent,
  NoticeQueueEvent,
} from './types';

const meta: Meta<typeof NoticeList> = {
  title: 'Components/NoticeList',
  component: NoticeList,
  parameters: {
    layout: 'fullscreen',
  },

  args: {
    defaultColor: 'info',
    size: 'medium',
    hideClearAll: true,
    limit: 3,
  },
  argTypes: {
    defaultColor: {
      control: 'select',
      options: ['info', 'advisory', 'normal', 'serious', 'critical'],
    },
    placement: {
      control: 'select',
      options: [
        'top left',
        'top',
        'top right',
        'right',
        'bottom right',
        'bottom',
        'bottom left',
        'left',
      ],
    },
  },
};

const colors = ['normal', 'advisory', 'info', 'serious', 'critical'] as const;

export default meta;

export const Default: StoryObj<typeof NoticeList> = {
  render: (args) => {
    const emit = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    return (
      <div className='p-l'>
        <div className='mb-l'>
          <Button
            onPress={() =>
              emit({
                message:
                  'This is a flexible snackbar that can be either a single or double line that will wrap accordingly when it gets too long for a single line.',
              })
            }
          >
            Create Notice
          </Button>
        </div>
        <NoticeList {...args} aria-label='notice-list' />
      </div>
    );
  },
};

function generateNotices({ color, target, metadata }: Partial<NoticeContent>) {
  return Array.from({ length: 5 }, () => {
    const id = uuid();
    return {
      id,
      target,
      message: id,
      color,
      metadata,
    } as NoticeContent;
  });
}

export const DequeueSingle: StoryObj<typeof NoticeList> = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const { useEmit, useOn } = useBus<
      NoticeQueueEvent | NoticeDequeueEvent | NoticeActionEvent
    >();
    const queue = useEmit(NoticeEventTypes.queue);
    const dequeue = useEmit(NoticeEventTypes.dequeue);
    const [notices, setNotices] = useState(
      generateNotices({ color: 'info' }).map((notice, index) => ({
        ...notice,
        color: colors[index],
      })),
    );
    const handleDequeue = (id: UniqueId) => {
      dequeue({ id });
      setNotices(notices.filter((notice) => notice.id !== id));
    };

    useOn(NoticeEventTypes.close, ({ payload: { id } }) => {
      setNotices(notices.filter((notice) => notice.id !== id));
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: only want to do this once
    useEffect(() => {
      notices.toReversed().forEach((notice) => {
        queue(notice);
      });
    }, []);

    return (
      <div className='flex gap-l p-l'>
        <div className='fg-primary-bold flex flex-1 flex-col gap-s'>
          {notices.map((notice) => (
            <Button key={notice.id} onPress={() => handleDequeue(notice.id)}>
              Dequeue: {notice.id}
            </Button>
          ))}
        </div>
        <div className='flex-1'>
          <NoticeList aria-label='notice-list' hideClearAll />
        </div>
      </div>
    );
  },
};

export const DequeueList: StoryObj<typeof NoticeList> = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const a = uuid();
    const b = uuid();
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: a }).forEach((notice, index) => {
        notice.color = colors[index];
        queue(notice);
      });
      generateNotices({ target: b }).forEach((notice, index) => {
        notice.color = colors[5 - index];
        queue(notice);
      });
    });
    return (
      <div className='flex gap-s p-l'>
        <div className='flex flex-1 flex-col gap-s'>
          <Button
            onPress={() =>
              dequeue({
                target: a,
              })
            }
          >
            Dequeue List A
          </Button>
          <Button
            onPress={() =>
              dequeue({
                target: b,
              })
            }
          >
            Dequeue List B
          </Button>
        </div>
        <div className='flex flex-1 flex-col gap-s'>
          <div className='fg-primary-bold'>List A</div>
          <NoticeList id={a} aria-label='info-notices' hideClearAll />
          <div className='fg-primary-bold'>List B</div>
          <NoticeList id={b} aria-label='serious-notices' hideClearAll />
        </div>
      </div>
    );
  },
};

export const DequeueColor: StoryObj<typeof NoticeList> = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const a = uuid();
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: a }).forEach((notice, index) => {
        notice.color = colors[index];
        queue(notice);
      });
    });
    return (
      <div className='flex gap-s p-l'>
        <div className='flex flex-1 flex-col gap-s'>
          {colors.map((color) => (
            <Button key={color} onPress={() => dequeue({ color })}>
              Dequeue: {color}
            </Button>
          ))}
        </div>
        <div className='flex-1'>
          <NoticeList id={a} aria-label='info-notices' limit={5} hideClearAll />
        </div>
      </div>
    );
  },
};

export const DequeueMetadata: StoryObj<typeof NoticeList> = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const a = uuid();
    const b = uuid();
    const c = uuid();
    const d = uuid();
    const metadataA = { shape: 'circle' };
    const metadataB = { shape: 'square' };
    const metadataC = { shapes: ['circle', 'square'] };
    const metadataD = { shapes: { shape: 'square' } };
    const metadata = [metadataA, metadataB, metadataC, metadataD];
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: a, metadata: metadataA }).forEach(
        (notice, index) => {
          notice.color = colors[index];
          notice.metadata = index % 2 === 0 ? metadataA : metadataB;
          notice.message = JSON.stringify(notice.metadata);
          queue(notice);
        },
      );
      generateNotices({ target: b, metadata: metadataB }).forEach(
        (notice, index) => {
          notice.color = colors[index];
          notice.metadata = index % 2 === 0 ? metadataB : metadataA;
          notice.message = JSON.stringify(notice.metadata);
          queue(notice);
        },
      );

      generateNotices({
        target: c,
        metadata: metadataC,
      }).forEach((notice, index) => {
        notice.color = colors[index];
        notice.metadata = index % 2 === 0 ? metadataC : metadataD;
        notice.message = JSON.stringify(notice.metadata);
        queue(notice);
      });
      generateNotices({
        target: d,
        metadata: metadataD,
      }).forEach((notice, index) => {
        notice.color = colors[index];
        notice.metadata = index % 2 === 0 ? metadataD : metadataC;
        notice.message = JSON.stringify(notice.metadata);
        queue(notice);
      });
    });
    return (
      <div className='flex gap-s p-l'>
        <div className='flex flex-1 flex-col gap-s'>
          {metadata.map((metadata) => (
            <Button
              key={JSON.stringify(metadata)}
              onPress={() => dequeue({ metadata })}
            >
              Dequeue: {JSON.stringify(metadata)}
            </Button>
          ))}
        </div>
        <div className='flex flex-1 flex-col gap-s'>
          <NoticeList id={a} aria-label='notices-a' hideClearAll />
          <NoticeList id={b} aria-label='notices-b' hideClearAll />
          <NoticeList id={c} aria-label='notices-c' hideClearAll />
          <NoticeList id={d} aria-label='notices-d' hideClearAll />
        </div>
      </div>
    );
  },
};

export const DequeueCombination: StoryObj<typeof NoticeList> = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const a = uuid();
    const b = uuid();
    const circleMetadata = { shape: 'circle' };
    const squareMetadata = { shape: 'square' };
    const queue = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);
    const dequeue = useEmit<NoticeDequeueEvent>(NoticeEventTypes.dequeue);
    useEffect(() => {
      generateNotices({ target: a }).forEach((notice, index) => {
        notice.metadata = index % 2 === 0 ? circleMetadata : squareMetadata;
        notice.message = JSON.stringify(notice.metadata);
        notice.color = index % 2 === 0 ? 'info' : 'serious';
        queue(notice);
      });
      generateNotices({ target: b }).forEach((notice, index) => {
        notice.metadata = index % 2 === 0 ? squareMetadata : circleMetadata;
        notice.message = JSON.stringify(notice.metadata);
        notice.color = index % 2 === 0 ? 'info' : 'serious';
        queue(notice);
      });
    });
    return (
      <div className='flex p-l'>
        <div className='flex flex-1 flex-col gap-s'>
          <Button
            onPress={() =>
              dequeue({
                target: a,
                color: 'serious',
                metadata: squareMetadata,
              })
            }
          >
            Dequeue: Serious squares from List A
          </Button>
        </div>
        <div className='flex h-full flex-1 flex-col justify-between gap-s'>
          <div className='fg-primary-bold'>List A</div>
          <NoticeList id={a} aria-label='notices-a' hideClearAll />
          <div className='fg-primary-bold'>List B</div>
          <NoticeList id={b} aria-label='notices-b' hideClearAll />
        </div>
      </div>
    );
  },
};
