import clsx from 'clsx'
import React, {useCallback, useState} from 'react'
import {v4} from 'uuid'
import {ChevronDownIcon, ChevronUpIcon, MinusCircleIcon, PlusCircleIcon} from '@heroicons/react/24/outline'
import {Input, Select} from '@headlessui/react'
import {AppButton} from './app-button'
import {Card, CardH3, CardSection} from '../wrapper/card'

export enum ActivityTypes {
  active = 'active',
  draft = 'draft',
  planable = 'planable',
  done = 'done',
}

export interface ActivityItem {
  id: string;
  type: string;
  step: Partial<{
    name: string;
    httpVerb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
    url: string;
    queryParams: object;
    headers: object;
  }>;
}

const content = [
  {
    id: v4(),
    type: ActivityTypes.active,
    step: {
      name: 'Search for Artist “Skrillex”: Retrieve Skrillex’s artist ID by searching for his name using the Spotify API.',
      httpVerb: 'GET',
      url: 'https://api.spotify.com/v1/search',
      queryParams: {
        q: 'Skrillex',
        type: 'artist',
        limit: '1',
      },
      headers: {
        Authorization: 'Bearer {access_token}',
        'Content-Type': 'application/json',
      },
    },
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {
      name: `Get Skrillex’s Top Tracks: Use the artist ID to fetch his top tracks from Spotify`,
      httpVerb: 'GET',
      url: 'https://api.spotify.com/v1/artists/{artist_id}/top-tracks',
      queryParams: {
        country: 'US',
      },
      headers: {
        Authorization: 'Bearer {access_token}',
        'Content-Type': 'application/json',
      },
    },
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {
      name: `Get Your Spotify User ID: Obtain your user ID by accessing your Spotify profile information.`,
      httpVerb: 'GET',
      url: 'https://api.spotify.com/v1/me',
      headers: {
        Authorization: 'Bearer {access_token}',
        'Content-Type': 'application/json',
      },
    },
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {
      name: `Create a New Playlist: Create a new playlist in your account to hold Skrillex’s top tracks.`,
      httpVerb: 'POST',
      url: 'https://api.spotify.com/v1/users/{user_id}/playlists',
      headers: {
        Authorization: 'Bearer {access_token}',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Skrillex Top Tracks',
        description: 'A playlist of top Skrillex tracks',
        public: true,
      },
    },
  },
  {
    id: v4(),
    type: ActivityTypes.draft,
    step: {
      name: `Add Tracks to the Playlist: Add the retrieved top tracks to your new playlist.`,
      httpVerb: 'POST',
      url: 'https://api.spotify.com/v1/playlists/{playlist_id}/tracks',
      headers: {
        Authorization: 'Bearer {access_token}',
        'Content-Type': 'application/json',
      },
      body: {
        uris: ['spotify:track:1', 'spotify:track:2', '...'], // Replace with actual track URIs
      },
    },
  },
] as ActivityItem[]

export function HttpCallForm({step}: { step?: ActivityItem['step'] }) {
  const elements = `border rounded-xl bg-transparent border-zinc-700`
  const inputClass = clsx(
    elements,
    'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
  )
  
  return <div className={clsx('flex flex-col gap-1')}>
    <div className={"flex flex-row gap-2"}>
      <Select name="status"
              className={clsx(elements, "h-full bg-transparent data-[hover]:shadow data-[focus]:bg-black-100")}
              aria-label="Project status"
              defaultValue={step?.httpVerb?.toLowerCase()}>
        <option value="get">Get</option>
        <option value="post">Post</option>
        <option value="put">Put</option>
        <option value="delete">Delete</option>
      </Select>
      <Input
        className={inputClass}
        defaultValue={step?.url}
      />
      <AppButton className={clsx(elements, "px-2 border-zinc-500")}
                 onClick={() => console.log(step)}>Send</AppButton>
    </div>
    {
      Object.entries(step?.queryParams ?? {}).map(entry => (<div className={"flex flex-row gap-1 pl-2"}>
        <Input
          className={inputClass}
          placeholder="Key"
          defaultValue={entry[0]}
        />
        <Input
          className={inputClass}
          placeholder="Value"
          defaultValue={entry[1]}
        />
        <div className={"flex flex-col justify-center"}>
          <MinusCircleIcon className={clsx("h-7 w-7 cursor-pointer")}/>
        </div>
      </div>))
    }
    <div
      className={"flex flex-col justify-center w-full rounded-xl hover:bg-black/5 border border-transparent hover:border-black py-2 px-1 transition pl-2"}>
      <PlusCircleIcon className={clsx("h-7 w-7 cursor-pointer")}/>
    </div>
  </div>
}

export function HttpCallCard({activity, index}: { activity: any, index?: number }) {
  const [isOpen, setIsOpen] = useState(activity.type === ActivityTypes.active)
  const handleToggle = useCallback(() => {
    setIsOpen(isOpen => !isOpen)
  }, [isOpen, setIsOpen])
  return <CardSection className={"flex flex-col gap-1"}>
    <div className={"h-full rounded-xl p-2"}>
      <div className={"flex flex-row gap-2"}>
        {(index ?? 0) + 1}) {activity.step.name}
        {isOpen && <ChevronUpIcon className={clsx("h-7 w-7 cursor-pointer ml-auto")} onClick={handleToggle}/>}
        {!isOpen && <ChevronDownIcon className={clsx("h-7 w-7 cursor-pointer ml-auto")} onClick={handleToggle}/>}
      </div>
    </div>
    {isOpen && <HttpCallForm step={activity.step}/>}
  </CardSection>
}

export function FeedContent() {
  return (
    <Card>
      <CardH3>Call Plan</CardH3>
      {content.map((activity, index) => (<HttpCallCard activity={activity} index={index} key={activity.id}/>))}
    </Card>
  )
}
