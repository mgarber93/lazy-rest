import React, {ReactElement, useCallback, useState} from 'react'
import clsx from 'clsx'
import {v4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import {Cog6ToothIcon, PlusIcon, ServerIcon} from '@heroicons/react/24/outline'
import {motion} from 'framer-motion'

import {headerTransparencyEffect, lgTransparent} from '../utils/transparent'
import {useAppDispatch, useAppSelector} from '../features/store'
import {useCurrentConversation} from '../hooks/current-conversation'
import {removeChat, startNewChat} from '../features/chat'
import {createConversation} from '../../models/conversation'
import {useKeyboardShortcuts} from '../hooks/use-key-press'
import {NavWidget, NavWidgetToConversation} from '../components/nav-widget'

export function HeaderLayout({children}: { children: ReactElement }) {
  const chats = useAppSelector(state => state.chats)
  const chat = useCurrentConversation()
  const [newChatId, setNewChatId] = useState<string>(v4())
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleRemoveChat = useCallback((chatId: string) => {
    dispatch(removeChat(chatId))
  }, [dispatch])
  const handleStartNewChat = useCallback(() => {
    dispatch(startNewChat(createConversation(newChatId)))
    setNewChatId(v4())
    return newChatId
  }, [dispatch, newChatId])
  const border = " border-neutral-300 dark:border-neutral-700"
  useKeyboardShortcuts({chats, chat, navigate, handleStartNewChat, handleRemoveChat})
  return (
    <div className={clsx(
      "w-full h-full",
      lgTransparent,
      "flex flex-col dark:text-neutral-50 border-0",
    )}>
      <header
        className={clsx(
          headerTransparencyEffect,
          "h-10 opacity-dynamic drag border-b-[0.5px]",
          border,
          "bg-neutral-200/50  py-[3px]",
        )}>
        <div className="w-full ml-[5rem] flex items-center h-full">
          <div className="flex flex-row h-full gap-[6px]">
            <NavWidget to={"/config"} className={"top-0"}>
              <Cog6ToothIcon tabIndex={-1} aria-hidden="true"
                className="h-[1.25rem] w-[1.25rem] mr-[0.25rem] pointer-events-none"/>
            </NavWidget>
            <NavWidget to={"/servers"} className={"top-0"}>
              <ServerIcon tabIndex={-1} aria-hidden="true"
                className="h-[1.25rem] w-[1.25rem] mr-[0.25rem] pointer-events-none"/>
            </NavWidget>
            <NavWidget to={`/chats/${newChatId}`} className={clsx(
              "w-10 h-10",
              "bg-neutral-200/50 dark:bg-black/5 border-r-[0.25px] dark:border-neutral-700",
            )}>
              <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]" onClick={handleStartNewChat}/>
            </NavWidget>
          </div>
        </div>
      </header>
      
      <div className="flex flex-row h-full">
        <aside className={clsx(
          "flex flex-col gap-y-0.5 h-full",
          headerTransparencyEffect,
          "p-1 drag",
          "border-r-[0.25px]",
          border,
        )}>
          {[...chats].reverse().map((chat) => (
            <motion.div layout key={chat.id}>
              <NavWidgetToConversation className="h-10 no-drag" chat={chat}/>
            </motion.div>
          ))}
        </aside>
        
        <main className={clsx(
          "flex-1 no-drag w-full h-full overflow-auto",
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
