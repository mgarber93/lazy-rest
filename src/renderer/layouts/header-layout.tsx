import React, {ReactElement, useCallback, useState} from 'react'
import clsx from 'clsx'
import {v4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import {Cog6ToothIcon, PlusIcon} from '@heroicons/react/24/outline'
import {XMarkIcon} from '@heroicons/react/16/solid'

import {headerTransparencyEffect, lgTransparent} from '../utils/transparent'
import {useAppDispatch, useAppSelector} from '../features/store'
import {useCurrentConversation} from '../hooks/current-conversation'
import {removeChat, startNewChat} from '../features/chat'
import {createConversation} from '../../models/conversation'
import {useKeyboardShortcuts} from '../hooks/use-key-press'
import {NavWidget} from '../components/nav-widget'

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
  
  useKeyboardShortcuts({chats, chat, navigate, handleStartNewChat, handleRemoveChat})
  return (
    <div className={clsx("w-full h-full")}>
      <div className={clsx(
        lgTransparent,
        "flex flex-col dark:text-neutral-50 border-0 w-full h-full",
      )}>
        <header
          className={clsx(
            headerTransparencyEffect,
            "sticky top-0 min-h-[37.5px] h-10 opacity-dynamic drag z-60 border-b-[0.5px] border-neutral-300 dark:border-b-neutral-700 z-1",
            "bg-neutral-200/50 dark:bg-neutral-950 pt-[3px] pb-[3px]",
          )}>
          <div className="w-full ml-[5rem] flex items-center h-[40px]">
            <div className={"flex flex-row h-full gap-[6px]"}>
              <NavWidget to={"/config"} className={"top-0"}>
                <Cog6ToothIcon tabIndex={-1} aria-hidden="true"
                  className="h-[1.25rem] w-[1.25rem] mr-[0.25rem] pointer-events-none"/>
              </NavWidget>
              {chats.map((chat) => (
                <NavWidget key={chat.id} to={`/chats/${chat.id}`} className={clsx("w-[10rem]")}>
                  <div className="flex w-30 max-h-1 items-center gap-0 w-full">
                    <div className="h-full whitespace-nowrap">
                      {chat.content.at(0)?.message?.slice(0, 17) ?? "new chat"}
                    </div>
                    <div className="ml-auto">
                      <XMarkIcon
                        onClick={() => handleRemoveChat(chat.id)}
                        className="h-[1.5rem] w-[1.5rem] hover:text-neutral-800 hover:bg-black/5 dark:hover:bg-white/25 ml-[0.25rem] rounded"
                      />
                    </div>
                  </div>
                </NavWidget>
              ))}
            
            </div>
          </div>
          <div className={"px-[1rem]"}>
          </div>
        </header>
        <div
          className={clsx("flex flex-row absolute top-[40px] opacity-dynamic drag w-full h-full", "bg-neutral-200/50 dark:bg-neutral-950")}>
          <NavWidget to={`/chats/${newChatId}`} className={clsx(
            "p-1 m-0.5",
            "absolute left-0 w-10 h-full", "bg-neutral-200/50 dark:bg-black/5 border-r-[0.25px] dark:border-neutral-700",
          )}>
            <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]" onClick={handleStartNewChat}/>
          </NavWidget>
          <div className={clsx("w-full h-full absolute left-10 overflow-scroll no-drag", "bg-white dark:bg-black/5")}>
            
            <div className={clsx(
              "bg-neutral-50/50 dark:bg-neutral-950/80",
              "w-full h-full overflow-scroll",
            )}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
