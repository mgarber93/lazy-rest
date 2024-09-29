import clsx from 'clsx'
import React, {ReactNode} from 'react'
import {v4} from 'uuid'
import {AppButton} from './app-button'
import {PlusIcon} from '@heroicons/react/24/outline'
import {Card, CardH3, CardSection} from '../wrapper/card'
import {Button, Input, Select} from '@headlessui/react'


export enum ActivityTypes {
  active = 'active',
  draft = 'draft',
  planable = 'planable',
  done = 'done',
}

export interface ActivityItem {
  id: string;
  type: string;
  step: {
    name: string;
  };
}

const content = [
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: 'Search for Artist “Skrillex”: Retrieve Skrillex’s artist ID by searching for his name using the Spotify API.'},
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: `Get Skrillex’s Top Tracks: Use the artist ID to fetch his top tracks from Spotify`},
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: `Get Your Spotify User ID: Obtain your user ID by accessing your Spotify profile information.`},
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: `Create a New Playlist: Create a new playlist in your account to hold Skrillex’s top tracks.`},
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {name: `Add Tracks to the Playlist: Add the retrieved top tracks to your new playlist.`},
  },
] as ActivityItem[]

export function HttpCallForm() {
  const elements = `border rounded-xl bg-black/5 border-zinc-700`
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

export function HttpCallCard({activity, index}: { activity: any, index?: number }) {
  return <CardSection className={"flex flex-col gap-1"}>
    <div className={"h-full rounded-xl p-2"}>
      <CardH3>{(index ?? 0) + 1}) {activity.step.name}</CardH3>
    </div>
    <HttpCallForm/>
  </CardSection>
}

export function PlanableComponent() {
  return <div className={"p-4 flex flex-row gap-2"}>
    <AppButton>
      <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]"/>
    </AppButton>
  </div>
}

export function DraftActivity() {

}

export function PlanableActivity() {
}

export function ActiveActivity({activity}: { activity: ActivityItem }) {
  return <li key={activity.id}
             className={clsx("relative flex flex-row gap-x-4", 'dark:bg-black/15 border p-4 rounded-2xl border-gray-600')}>
    <p className="flex-auto">
      <span className={clsx("font-medium")}>
        {activity.step.name}
      </span>
    </p>
  </li>
}

function renderActivityItem(activity: ActivityItem, index: number): ReactNode {
  switch (activity.type) {
    case ActivityTypes.active: {
      return <ActiveActivity activity={activity}/>
    }
    case ActivityTypes.draft: {
      return <HttpCallCard activity={activity} index={index}/>
    }
    case ActivityTypes.planable: {
      return <PlanableComponent/>
    }
    default: {
      throw new Error(`Unsupported type "${activity.type}"`)
    }
  }
}

export function FeedContent() {
  return (
    <Card>
      <CardH3>Call Plan</CardH3>
      <ul role="list" className="space-y-2">
        {content.map(renderActivityItem)}
      </ul>
    </Card>
  )
}
