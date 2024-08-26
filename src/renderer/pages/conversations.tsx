import React from 'react'
import {ThreeColumnLayout} from '../layouts/three-column-layout'
import {useAppSelector} from '../features/store'

export function Component() {
  const conversations = useAppSelector(state => state.chats)
  return <div className="w-full h-full">
    <div className={"fixed w-full h-full bg-white dark:bg-black opacity-dynamic -z-40"}></div>
    <div className="px-2 flex flex-col gap-y-7">
      {
        conversations.map((conversation) => (
          <div key={conversation.id}>
            <span className={"text-xs text-nowrap"}>
              {conversation.id}
            </span>
          </div>
        ))
      }
    </div>
  </div>
}


export function ConversationsPage() {
  return (
    <ThreeColumnLayout
      main={<Component/>}
      aside={<Component/>}
    >
    </ThreeColumnLayout>
  )
}

