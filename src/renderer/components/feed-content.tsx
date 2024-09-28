import clsx from 'clsx'
import React from 'react'
import {cardEffect} from '../utils/card'
import {v4} from 'uuid'
import {AuthoredContent} from '../../models/content'
import {Button} from '@headlessui/react'


export enum ActivityTypes {
  draft = 'draft',
  done = 'done',
}

export interface ActivityItem {
  id: string;
  type: string;
  step: {
    name: string;
  };
  date: string;
  dateTime: string;
}

const content = [
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: 'Search for artist Skrillex to get id for Skrillex'},
    date: '2023-10-05',
    dateTime: '2023-10-05T18:30:00Z',
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: `Query songs using Skrillex's id from step 1 sorted by play count`},
    date: '2023-10-04',
    dateTime: '2023-10-04T18:30:00Z',
  },
] as ActivityItem[]

export interface FeedContentProps {
  content?: AuthoredContent
}

export function FeedContent() {
  return (
    <div className={clsx(cardEffect, " p-4 rounded-xl")}>
      <div className={'text-sm mb-2 w-full border-b border-gray-200 dark:border-zinc-600 text-gray-500'}>
        Call plan
      </div>
      <ul role="list" className="space-y-0">
        {content.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id}
              className={clsx("relative flex gap-x-4", activityItemIdx % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800', 'border-b border-gray-600')}>
            <p className="flex-auto">
              <span className={clsx("font-medium", activityItem.type === 'draft' && 'text-gray-500')}>
                {activityItem.step.name}
              </span>
            </p>
            <Button className={clsx("border hover:p-4 transition-all")}
                    onClick={() => console.log('hello world')}>Detail</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
