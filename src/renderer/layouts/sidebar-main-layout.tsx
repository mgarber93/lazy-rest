import {ChartPieIcon, ChatBubbleLeftIcon, CloudIcon} from '@heroicons/react/24/outline'
import {classNames} from '../utils/classNames'
import React, {ReactNode} from 'react'
import {Tools} from './tools'

export const navigation = [
  {name: 'Conversations', href: '#', icon: ChatBubbleLeftIcon, current: false},
  {name: 'Api', href: '#', icon: CloudIcon, current: false},
  {name: 'Reports', href: '#', icon: ChartPieIcon, current: false},
]

export function NavigationComponent() {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-zinc-50 text-zinc-600'
                : 'text-zinc-700 hover:bg-zinc-50  dark:hover:bg-zinc-950 hover:text-zinc-600',
              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
            )}
          >
            <item.icon
              aria-hidden="true"
              className={classNames(
                item.current ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-600',
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


export function Sidebar() {
  return <nav
    className="flex flex-col h-full w-full bg-white dark:bg-black opacity-dynamic px-8 pb-4 max-w-64 overflow-y-hidden">
    <div className="h-2 shrink-0"/>
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li>
        <NavigationComponent/>
      </li>
      <li>
        <Tools/>
      </li>
    </ul>
  </nav>
}


export default function SidebarMainLayout(props: { children: ReactNode }) {
  return <>
    <div className={"flex flex-col h-full"}>
      <header className="w-full h-10 bg-white dark:bg-black opacity-dynamic drag top-0 z-60">
      </header>
      <div className={"h-full flex flex-row"}>
        <Sidebar/>
        <div className={"h-full w-full flex flex-row p-4 drop-shadow-2xl bg-white dark:bg-black"}>
          <main
            className="p-4 grow">
            {props.children}
          </main>
        </div>
      </div>
    </div>
  </>
}
