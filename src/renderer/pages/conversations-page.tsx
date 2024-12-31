import React from 'react'
import clsx from 'clsx'
import {AnimatePresence, motion} from "framer-motion"

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollUserInputPageLayout} from '../layouts/scroll-container'
import {ConversationContent} from '../components/conversation-content'
import {HeaderProps} from '../wrapper/header'

export function ConversationsPage() {
  const convo = useCurrentConversation()
  const parameters = {
    showSearch: true,
    showHistory: true,
    showConfig: true,
    historyCount: 10,
    historyLength: 10
  } satisfies HeaderProps
  return (
    <HeaderLayout layoutProps={parameters}>
      <div className={clsx("w-full h-full")}>
        <ScrollUserInputPageLayout sections={[]}>
          <div className={clsx(
            "flex flex-col gap-y-1.5 py-1",
            "border-neutral-100 dark:border-neutral-800",
          )}>
            <AnimatePresence>
              {
                convo.content.map(content => (
                    <motion.div
                      className={clsx()}
                      transition={{duration: 10 / 1000}}
                      key={content.id}
                    >
                      <ConversationContent content={content} chatId={convo.id} />
                    </motion.div>
                  ),
                )
              }
            </AnimatePresence>
          </div>
        </ScrollUserInputPageLayout>
      </div>
    </HeaderLayout>
  )
}
