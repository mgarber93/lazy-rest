import clsx from 'clsx'
import React from 'react'
import {CheckCircleIcon} from '@heroicons/react/24/outline'
import {cardEffect} from '../utils/card'
import {v4} from 'uuid'
import {AuthoredContent} from '../../models/content'


export enum ActivityTypes {
  draft = 'draft',
}

export interface ActivityItem {
  id: string;
  type: string;
  person: {
    name: string;
  };
  date: string;
  dateTime: string;
}

const content = [
  {
    id: v4(),
    type: ActivityTypes.draft,
    person: {name: 'Search for artist Skrillex to get id'},
    date: '2023-10-05',
    dateTime: '2023-10-05T18:30:00Z',
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    person: {name: `Search for artists with Skrillex's id within rest service`},
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
      <ul role="list" className="space-y-6">
        {content.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={clsx(
                activityItemIdx === content.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center',
              )}
            >
              <div className="w-px bg-gray-200 dark:bg-zinc-200"/>
            </div>
            {
              <>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center">
                  {activityItem.type === 'paid' ? (
                    <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-600 bg-white rounded-xl"/>
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-100 ring-1 ring-gray-300"/>
                  )}
                </div>
                <p className="flex-auto py-0.5 ">
                  <span className="font-medium">{activityItem.person.name}</span> {activityItem.type} the
                  invoice.
                </p>
                <time dateTime={activityItem.dateTime} className="flex-none py-0.5 ">
                  {activityItem.date}
                </time>
              </>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}
