import React from 'react'
import {classNames} from '../utils/classNames'

const tools = [
  {id: 1, name: 'Spotify', href: '#', initial: 'S', current: false},
  {id: 2, name: 'Weather', href: '#', initial: 'W', current: false},
]
export const Tools: React.FC = () => {
  return (
    <>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {tools.map((team) => (
          <li key={team.name}>
            <a
              href={team.href}
              className={classNames(
                team.current
                  ? 'bg-zinc-50 text-zinc-600'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-950',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
              )}
            >
              <span
                className={classNames(
                  team.current
                    ? 'border-zinc-600 text-zinc-600'
                    : 'border-zinc-200 text-zinc-400 group-hover:border-zinc-600 group-hover:text-zinc-600',
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white dark:bg-black text-[0.625rem] font-medium',
                )}
              >
                {team.initial}
              </span>
              <span className="truncate">{team.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
