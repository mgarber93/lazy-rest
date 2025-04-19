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
      <div className={clsx("w-full h-full flex flex-col")}>
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
        <UserInputForm classList={"mt-auto min-h-[4rem]"}/>
      </div>
    </HeaderLayout>
  )
}
