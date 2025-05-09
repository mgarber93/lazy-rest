import React, {ReactElement, useCallback} from "react"
import {NavLink, useNavigate} from "react-router-dom"
import clsx from "clsx"
import {XMarkIcon} from '@heroicons/react/16/solid'
import {Conversation} from '../../models/conversation'
import {removeChat} from '../features/chat'
import {useAppDispatch} from '../features/store'


export function NavWidget({children, to, className}: {
  children: ReactElement,
  to: string,
  className?: string
}) {
  const classes = `flex rounded no-drag items-center pl-[0.5rem] pr-[0.25rem] h-8 text-[0.75rem] font-semibold`
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
            `bg-black dark:border-neutral-900`,
            "hover:bg-white bg-neutral-200 dark:bg-neutral-900 hover:dark:bg-neutral-900 dark:text-white",
          ),
          !isActive && clsx("bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 dark:bg-transparent dark:border-white/10 text-neutral-700 dark:text-neutral-300"),
          className,
        )}>
      {children}
    </NavLink>
  )
}

export function NavWidgetToConversation({className, chat}: { className?: string, chat: Conversation }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleRemoveChat = useCallback((chatId: string) => {
    dispatch(removeChat(chatId))
  }, [dispatch])
  
  return <NavWidget key={chat.id} to={`/chats/${chat.id}`} className={clsx("w-[10rem] group")}>
    <div className="flex w-30 max-h-1 items-center gap-0 w-full ">
      <div className="h-full whitespace-nowrap group">
        {chat.content.at(0)?.message?.slice(0, 17) ?? "new chat"}
      </div>
      <div className="ml-auto hidden group-hover:block">
        <XMarkIcon
          onClick={() => handleRemoveChat(chat.id)}
          className="h-[1.5rem] w-[1.5rem] hover:text-neutral-800 hover:bg-black/5 dark:hover:bg-white/25 ml-[0.25rem] rounded"
        />
      </div>
    </div>
  </NavWidget>
}
