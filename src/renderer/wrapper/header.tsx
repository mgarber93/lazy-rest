import React, {ReactElement, useCallback, useState} from 'react'
import {Cog6ToothIcon, PlusIcon} from '@heroicons/react/24/outline'
import {nanoid} from '@reduxjs/toolkit'
import {NavLink} from 'react-router-dom'
import {useAppSelector} from '../features/store'

export function HeaderTab({children, to}: {
  children: ReactElement,
  to: string
}) {
  return <>
    <NavLink
      to={to}
      className={({isActive}) => `flex h-full items-center border-l border-r pl-[1rem] pr-[1rem] border-zinc-400 dark:border-zinc-700 text-sm font-semibold text-zinc-600 ${isActive ? "bg-zinc-700 text-zinc-900" : ''}`}>
      {children}
    </NavLink>
  </>
}

export interface Navigable {
  id: string
}

export function Header() {
  const [pages, setPages] = useState<Navigable[]>([])
  const chats = useAppSelector(state => state.chats)
  const newChatId = nanoid()
  const createNewTab = useCallback(() => {
    // todo
  }, [pages, setPages])
  
  return <header
    className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 opacity-dynamic drag top-0 z-60 flex flex-row border-b-[0.5px] border-zinc-400 dark:border-zinc-600">
    <ul className="h-full ml-[5rem] flex items-center no-drag">
      <HeaderTab to={"config"}>
        <Cog6ToothIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]"/>
      </HeaderTab>
      {
        chats.map((chat) => (
          <HeaderTab key={chat.id} to={`/chats/${chat.id}`}>
            <div className="min-w-20">
              {chat.content.at(0)?.message}
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
