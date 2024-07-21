import {Bars3Icon, ChartPieIcon, ChatBubbleLeftIcon, Cog6ToothIcon, HomeIcon} from '@heroicons/react/24/outline'
import {classNames} from '../utils/classNames'
import React, {ReactNode} from 'react'

const navigation = [
  {name: 'Dashboard', href: '#', icon: HomeIcon, current: false},
  {name: 'Conversations', href: '#', icon: ChatBubbleLeftIcon, current: false},
  {name: 'Reports', href: '#', icon: ChartPieIcon, current: false},
]

function NavigationComponent() {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
            )}
          >
            <item.icon
              aria-hidden="true"
              className={classNames(
                item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                'h-6 w-6 shrink-0',
              )}
            />
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

const tools = [
  {id: 1, name: 'Spotify', href: '#', initial: 'S', current: false},
  {id: 2, name: 'Weather', href: '#', initial: 'W', current: false},
]

const Tools: React.FC<{}> = () => {
  return (
    <>
      <div className="text-xs font-semibold leading-6 text-gray-400">Your APIs</div>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {tools.map((team) => (
          <li key={team.name}>
            <a
              href={team.href}
              className={classNames(
                team.current
                  ? 'bg-gray-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
              )}
            >
              <span
                className={classNames(
                  team.current
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
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

export default function SidebarMainLayout(props: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-row h-full w-full">
        <div className="lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div
            className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-black opacity-90 backdrop-blur-sm px-8 pb-4">
            <div className="h-8 shrink-0"/>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <NavigationComponent/>
                </li>
                <li>
                  <Tools/>
                </li>
                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-600 hover:bg-gray-800"
                  >
                    <Cog6ToothIcon aria-hidden="true" className="h-6 w-6 shrink-0"/>
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <main
          className="lg:pl-72 px-4 py-10 sm:px-6 lg:px-8 lg:py-6 bg-white dark:bg-black grow">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6"/>
          </button>
          {props.children}
        </main>
      </div>
    </>
  )
}
