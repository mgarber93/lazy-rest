import React, {ReactElement, useCallback, useState} from 'react'
import {Cog6ToothIcon, PlusIcon} from '@heroicons/react/24/outline'
import {XMarkIcon} from '@heroicons/react/16/solid'
import {NavLink} from 'react-router-dom'
import clsx from 'clsx'
import {useAppDispatch, useAppSelector} from '../features/store'
import {removeChat, startNewChat} from '../features/chat'
import {createConversation} from '../../models/conversation'
import {transparent} from '../utils/transparent'
import {v4} from 'uuid'


export function HeaderTab({children, to, className}: {
  children: ReactElement,
  to: string,
  className?: string
}) {
  const classes = `flex rounded no-drag bg-white dark:bg-zinc-900 dark:text-white h-full items-center pl-[0.5rem] pr-[0.25rem] text-xs font-semibold hover:bg-white/50 dark:hover:bg-zinc-800`
  const border = `border border-zinc-300 dark:border-zinc-800`
  return (
    <NavLink
      to={to}
      className={
        ({isActive}) => clsx(
          classes,
          border,
          isActive && clsx(
            "drop-shadow",
            "bg-zinc-700 hover:bg-zinc-700 dark:bg-zinc-900 hover:dark:bg-zinc-900 text-white",
          ),
          className,
        )}>
      {children}
    </NavLink>
  )
}

export function Header() {
  const chats = useAppSelector(state => state.chats)
  const [newChatId, setNewChatId] = useState<string>(v4())
  const dispatch = useAppDispatch()
  
  // Define callback for removing a chat
  const handleRemoveChat = useCallback((chatId: string) => {
    dispatch(removeChat(chatId))
  }, [dispatch])
  
  // Define callback for starting a new chat
  const handleStartNewChat = useCallback(() => {
    dispatch(startNewChat(createConversation(newChatId)))
    setNewChatId(v4())
  }, [dispatch, newChatId])
  
  return (
    <header
      className={clsx(
        transparent,
        "w-full sticky top-0 min-h-[37.5px] h-10 opacity-dynamic drag z-60 flex flex-row border-b-[0.5px] border-zinc-300 dark:border-b-zinc-700 z-1 pb-1",
        "bg-zinc-200/50 dark:bg-zinc-950 pt-[3px] pb-[3px]",
      )}>
      <ul className="w-full h-full ml-[5rem] flex items-center overflow-scroll gap-1">
        <HeaderTab to={"/config"} className={""}>
          <Cog6ToothIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem] mr-[0.25rem]"/>
        </HeaderTab>
        <div className={clsx('overflow-scroll flex flex-row w-full h-full gap-1')}>
          {chats.map((chat) => (
            <HeaderTab key={chat.id} to={`/chats/${chat.id}`} className={clsx("w-[10rem]")}>
              <div className="flex w-30 max-h-1 items-center gap-0 w-full">
                <div className="h-full whitespace-nowrap">
                  {chat.content.at(0)?.message.slice(0, 17) ?? "new chat"}
                </div>
                <div className="ml-auto">
                  <XMarkIcon
                    onClick={() => handleRemoveChat(chat.id)}
                    className="h-[1.5rem] w-[1.5rem] hover:text-zinc-800 hover:bg-black/5 dark:hover:bg-white/25 ml-[0.25rem] rounded"
                  />
                </div>
              </div>
            </HeaderTab>
          ))}
          <HeaderTab to={`/chats/${newChatId}`} className={clsx('pr-[0.5rem]')}>
            <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]" onClick={handleStartNewChat}/>
          </HeaderTab>
        </div>
      </ul>
    </header>
  )
}
