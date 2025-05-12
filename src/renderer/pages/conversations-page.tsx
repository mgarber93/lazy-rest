import React, {useEffect, useRef} from 'react'
import clsx from 'clsx'
import {AnimatePresence, motion} from "framer-motion"

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ConversationContent} from '../components/conversation-content'
import {UserInputForm} from './user-input-form'

export function ConversationsPage() {
  const convo = useCurrentConversation()
  const hasContent = convo.content.length > 0
  const contentRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [convo.content])
  
  return (
    <HeaderLayout
      classList={clsx(
        "p-2 flex flex-col bg-neutral-100 dark:bg-neutral-800",
        !hasContent && "justify-center"
      )}>
      <>
        {hasContent && (
          <div ref={contentRef} className="flex-1 overflow-y-auto px-2 pb-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {convo.content.map(msg => (
                <motion.div
                  key={msg.id}
                  transition={{duration: .1}}
                  layout
                >
                  <ConversationContent content={msg} chatId={msg.id}/>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        <motion.div
          layout
          className={clsx(
            "min-h-[4rem] shrink-0",
            hasContent ? "mt-auto" : "my-auto"
          )}
        >
          <UserInputForm/>
        </motion.div>
      </>
    </HeaderLayout>
  )
}
