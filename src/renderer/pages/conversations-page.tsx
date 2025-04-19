import React from 'react'
import clsx from 'clsx'
import {AnimatePresence, motion} from "framer-motion"

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ConversationContent} from '../components/conversation-content'
import {UserInputForm} from './user-input-form'

export function ConversationsPage() {
  const convo = useCurrentConversation()
  return (
    <HeaderLayout>
      <div className={clsx("w-full min-h-full p-2 flex flex-col gap-4 overflow-scroll", "bg-neutral-100 dark:bg-neutral-800")}>
        <AnimatePresence>
          {
            convo.content.map(content => (
              <motion.div
                className={clsx()}
                transition={{duration: 10 / 1000}}
                key={content.id}
              >
                <ConversationContent content={content} chatId={content.id}/>
              </motion.div>
            ),
            )
          }
        </AnimatePresence>
        <UserInputForm classList={"mt-auto min-h-[4rem]  sticky bottom-10 "}/>
      </div>
    </HeaderLayout>
  )
}
