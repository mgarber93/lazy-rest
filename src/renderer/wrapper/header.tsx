import {ReactElement, useCallback, useState} from 'react'
import {Cog6ToothIcon, PlusIcon} from '@heroicons/react/24/outline'
import {nanoid} from '@reduxjs/toolkit'
import {useAppSelector} from '../features/store'

export function HeaderTab({children, clickHandler}: { children: ReactElement, clickHandler: () => void }) {
  return <>
    <li className={"h-full flex items-center z-10"}>
      <div className={"h-full border-l border-zinc-400 dark:border-zinc-700"}></div>
    </li>
    <li
      onClick={clickHandler}
      className={"pl-[1.25rem] pr-[1.25rem] pt-2 pb-2 flex items-center justify-center h-full dark:hover:bg-zinc-700 hover:bg-zinc-400 cursor-pointer"}
    >
      <a
        href="#"
        className={"group flex rounded-md text-sm font-semibold text-zinc-600"}
      >
        {children}
      </a>
    </li>
    <li className="h-full flex items-center">
      <div className="h-full border-l border-zinc-400 dark:border-zinc-700"></div>
    </li>
  </>
}

export interface Navigable {
  id: string
}

export function Header() {
  const [pages, setPages] = useState<Navigable[]>([])
  const chats = useAppSelector(state => state.chats)
  const navigateTo = useCallback(() => {
    // @todo
  }, [])
  
  const createNewTab = useCallback(() => {
    const id = nanoid()
    setPages([...pages, {id}])
  }, [pages, setPages])
  
  return <header
    className="w-full h-10 bg-zinc-200 dark:bg-zinc-800 opacity-dynamic drag top-0 z-60 flex flex-row border-b-[0.5px] border-zinc-400 dark:border-zinc-600">
    <ul className="h-full ml-[5rem] flex items-center no-drag">
      <HeaderTab clickHandler={navigateTo}>
        <Cog6ToothIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]"/>
      </HeaderTab>
      {
        chats.map((chat) => (
          <HeaderTab key={chat.id} clickHandler={navigateTo}>
            <div className="min-w-20">
              {chat.content.at(0)?.message}
            </div>
          </HeaderTab>
        ))
      }
      <HeaderTab clickHandler={createNewTab}>
        <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]"/>
      </HeaderTab>
    </ul>
  </header>
}
