import React, {ReactElement, useState} from 'react'
import {Cog6ToothIcon, PlusIcon} from '@heroicons/react/24/outline'
import {XMarkIcon} from '@heroicons/react/16/solid'
import {nanoid} from '@reduxjs/toolkit'
import {NavLink} from 'react-router-dom'
import {useAppSelector} from '../features/store'

export function HeaderTab({children, to}: {
  children: ReactElement,
  to: string
}) {
  const classes = `flex h-full items-center border-l pl-[0.5rem] pr-[0.25rem] border-zinc-400 dark:border-zinc-700 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5`
  return <>
    <NavLink
      to={to}
      className={({isActive}) => `${classes} ${isActive ? "bg-zinc-700 text-zinc-50 bg-white/15" : 'text-zinc-400'}`}
    >
      {children}
    </NavLink>
  </>
}

export function Header() {
  const chats = useAppSelector(state => state.chats)
  const [newChatId] = useState<string>(nanoid())
  
  return <header
    className="w-full sticky top-0 min-h-[37.5px] h-10 bg-zinc-200 dark:bg-zinc-950 opacity-dynamic drag z-60 flex flex-row border-b-[0.5px] border-zinc-400 dark:border-zinc-600"
  >
    <ul className="w-full h-full ml-[5rem] flex items-center no-drag">
      <HeaderTab to={"/config"}>
        <Cog6ToothIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem] mr-[0.25rem]"/>
      </HeaderTab>
      {
        chats.map((chat) => (
          <HeaderTab key={chat.id} to={`/chats/${chat.id}`}>
            <div className="flex min-w-20 max-h-1 items-center gap-0 w-full">
              <div className="text-xs h-full">
                {chat.content.at(0)?.message.slice(0, 13) ?? "new chat"}
              </div>
              <div className="ml-auto">
                <XMarkIcon className="h-[1.5rem] w-[1.5rem] hover:bg-black/5 dark:hover:bg-white/5 ml-[0.25rem]"/>
              </div>
            </div>
          </HeaderTab>
        ))
      }
      <HeaderTab to={`/chats/${newChatId}`}>
        <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]"/>
      </HeaderTab>
    </ul>
  </header>
}
