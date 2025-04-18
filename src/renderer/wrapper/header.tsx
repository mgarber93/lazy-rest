import React, {ReactElement, useCallback, useState} from "react"
import {Cog6ToothIcon, PlusIcon} from "@heroicons/react/24/outline"
import {XMarkIcon} from "@heroicons/react/16/solid"
import {NavLink, useNavigate} from "react-router-dom"
import clsx from "clsx"
import {useAppDispatch, useAppSelector} from "../features/store"
import {removeChat, startNewChat} from "../features/chat"
import {createConversation} from "../../models/conversation"
import {headerTransparencyEffect} from "../utils/transparent"
import {v4} from "uuid"
import {useKeyPress} from "../hooks/use-key-press"
import {useCurrentConversation} from "../hooks/current-conversation"


export function HeaderTab({children, to, className}: {
  children: ReactElement,
  to: string,
  className?: string
}) {
  const classes = `flex rounded no-drag bg-white h-full items-center pl-[0.5rem] pr-[0.25rem] min-h-[1rem] text-xs font-semibold`
  const borderActive = `!border-neutral-800 dark:border-neutral-700`
  const border = `border border-transparent`
  return (
    <NavLink
      to={to}
      tabIndex={-1}
      className={
        ({isActive}) => clsx(
          classes,
          border,
          isActive && clsx(
            borderActive,
            "bg-white hover:bg-white dark:bg-neutral-800 hover:dark:bg-neutral-800 dark:text-white",
          ),
          !isActive && clsx("bg-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:bg-neutral-900"),
          className,
        )}>
      {children}
    </NavLink>
  )
}

export function Header() {
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
  
  useKeyPress(
    (event: KeyboardEvent) => {
      return event.altKey && event.metaKey && event.key === "ArrowRight"
    },
    (event: KeyboardEvent) => {
      const currentChatIndex = chats.findIndex(c => c.id === chat?.id) ?? -1
      const isConfigRoute = location.hash.includes('config')
      if (currentChatIndex === -1 || currentChatIndex === chats.length - 1) {
        navigate(`/config`)
      } else if (isConfigRoute) {
        navigate(`/chats/${chats[0].id}`)
      } else {
        const nextChatIndex = (currentChatIndex + 1) % chats.length
        const nextChat = chats[nextChatIndex]
        nextChat && navigate(`/chats/${nextChat.id}`)
      }
    },
  )
  
  useKeyPress(
    (event: KeyboardEvent) => {
      return event.altKey && event.metaKey && event.key === "ArrowLeft"
    },
    (event: KeyboardEvent) => {
      const currentChatIndex = chats.findIndex(c => c.id === chat?.id) ?? -1
      if (currentChatIndex <= 0) {
        navigate(`/config`)
      } else {
        const nextChatIndex = (currentChatIndex - 1) % chats.length
        const nextChat = chats[nextChatIndex]
        nextChat && navigate(`/chats/${nextChat.id}`)
      }
    },
  )
  useKeyPress(
    (event: KeyboardEvent) => {
      return event.metaKey && event.key === "t"
    },
    (event: KeyboardEvent) => {
      const nextChat = handleStartNewChat()
      nextChat && navigate(`/chats/${nextChat}`)
    },
  )
  useKeyPress(
    (event: KeyboardEvent) => {
      return event.metaKey && event.key === "w"
    },
    (event: KeyboardEvent) => {
      event.preventDefault()
      handleRemoveChat(chat.id)
    },
  )
  useKeyPress(
    (event: KeyboardEvent) => {
      return event.metaKey && event.key === "."
    },
    (event: KeyboardEvent) => {
      navigate("/config")
    },
  )
  return (
    <header
      className={clsx(
        headerTransparencyEffect,
        "sticky top-0 min-h-[37.5px] h-10 opacity-dynamic drag z-60 flex flex-row border-b-[0.5px] border-neutral-300 dark:border-b-neutral-700 z-1",
        "bg-neutral-200/50 dark:bg-neutral-950 pt-[3px] pb-[3px] ",
      )}>
      <div className="w-full ml-[5rem] flex items-center h-[2.5rem]">
        <div className={"flex flex-row h-full pb-[6px] gap-[6px]"}>
          <HeaderTab to={"/config"} className={"top-0"}>
            <Cog6ToothIcon tabIndex={-1} aria-hidden="true"
                           className="h-[1.25rem] w-[1.25rem] mr-[0.25rem] pointer-events-none"/>
          </HeaderTab>
          {chats.map((chat) => (
            <HeaderTab key={chat.id} to={`/chats/${chat.id}`} className={clsx("w-[10rem]")}>
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
            </HeaderTab>
          ))}
          <HeaderTab to={`/chats/${newChatId}`} className={clsx("pr-[0.5rem]")}>
            <PlusIcon aria-hidden="true" className="h-[1.25rem] w-[1.25rem]" onClick={handleStartNewChat}/>
          </HeaderTab>
        </div>
      </div>
    </header>
  )
}
