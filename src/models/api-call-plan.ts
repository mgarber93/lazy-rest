import {v4} from 'uuid'

export interface ApiCallPlan {
  steps: SequenceActivity[]
}

export type THttp = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface HttpRequestPlan {
  name?: string;
  httpVerb: THttp;
  url: string;
  queryParams?: object;
  headers: Record<string, string>;
  body?: object | string
  response?: HttpResponse
}

export interface HttpResponse<T = any> {
  data: T
  status: number
  interpretation?: string
}

export enum ProgressStage {
  active = 'active',
  draft = 'draft',
  planable = 'planable',
  done = 'done',
}

/**
 * An action in a sequence that allows for planning
 */
export interface SequenceActivity {
  id: string
  progressStage: ProgressStage
  step: Partial<HttpRequestPlan>
}

export interface SummarizationJob {
  apiCallPlan: ApiCallPlan,
  contentId: string,
  chatId: string
  index: number
}

export const mockSequence = [
  {
    id: v4(),
    progressStage: ProgressStage.active,
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
    progressStage: ProgressStage.draft,
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
    progressStage: ProgressStage.draft,
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
    progressStage: ProgressStage.draft,
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
    progressStage: ProgressStage.draft,
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
] satisfies SequenceActivity[]
