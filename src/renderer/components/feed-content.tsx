import clsx from 'clsx'
import React, {useCallback, useState} from 'react'
import {v4} from 'uuid'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/outline'
import {CardSection} from '../wrapper/card'
import {HttpCallForm} from './http-call-form'

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
    <div className={"flex flex-col gap-2"}>
      {content.map((activity, index) => (<HttpCallCard activity={activity} index={index} key={activity.id}/>))}
    </div>
  )
}
