import clsx from 'clsx'
import React from 'react'
import {cardEffect} from '../utils/card'
import {v4} from 'uuid'
import {AuthoredContent} from '../../models/content'
import {Button, Input, Select} from '@headlessui/react'


export enum ActivityTypes {
  active = 'active',
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
    type: ActivityTypes.active,
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

export function HttpCallCard() {
  const elements = `border rounded-xl bg-black/15 border-zinc-700`
  return <div className={"p-4 flex flex-row gap-2"}>
    <Select name="status"
            className={clsx(elements, "h-full bg-transparent data-[hover]:shadow data-[focus]:bg-blue-100")}
            aria-label="Project status">
      <option value="get">Get</option>
      <option value="post">Post</option>
      <option value="put">Put</option>
      <option value="delete">Delete</option>
    </Select>
    <Input
      className={clsx(
        elements,
        'flex-grow py-1.5 px-3 text-sm/6 text-white',
        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
      )}
    />
    <Button className={clsx(elements, "px-2 border-zinc-500")}
            onClick={() => console.log('hello world')}>Send</Button>
  </div>
}

export function FeedContent() {
  return (
    <div className={clsx(cardEffect, "p-4 rounded-xl")}>
      <div className={'text-sm mb-2 w-full border-b border-gray-200 dark:border-zinc-600 text-gray-500'}>
        Call plan
      </div>
      <ul role="list" className="space-y-2">
        {content.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id}
              className={clsx("relative flex flex-col gap-x-4", 'bg-black/15 border p-4 rounded-2xl border-gray-600')}>
            <p className="flex-auto">
              <span className={clsx("font-medium", activityItem.type === 'draft' && 'text-gray-500')}>
                {activityItem.step.name}
              </span>
            </p>
            {
              activityItem.type === 'active' && <HttpCallCard/>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}
