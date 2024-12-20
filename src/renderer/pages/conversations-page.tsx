import React, {ReactNode, RefObject} from 'react'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {AnimatePresence, motion} from "framer-motion"

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollUserInputPageLayout} from '../layouts/scroll-container'
import {AuthoredContent} from '../../models/content'
import {FeedContent} from '../components/feed-content'
import {CardSection} from '../wrapper/card'

export function ConversationContent({content}: { content: AuthoredContent }) {
  if (content.apiCallPlan) {
    return <FeedContent contentId={content.id} apiCallPlan={content.apiCallPlan}/>
  } else {
    return <div
      className={clsx(
        'leading-relaxed text-xl flex flex-col py-1 transition duration-300 dark:border-white/50 rounded-xl',
        content.role === "user" && "ml-auto w-fit",
      )}
    >
      {
        content.role === "user" && <CardSection>
          <span
            className={clsx('flex-1 text-right max-w-[40vw]  flex ml-auto')}
            key={content.id}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
          </span>
        </CardSection>
      }
      {
        content.role !== "user" && <div>
                      <span
                        className={clsx('flex-1')}
                        key={content.id}
                      >
            <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
          </span>
        </div>
      }
    </div>
  }
}

export function MapContentToCardSection({content, ref}: { content: AuthoredContent, ref: RefObject<HTMLDivElement> }) {
  const delay = 10
  return <React.Fragment key={content.id}>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0, height: 0}}
      key={content.id}
      transition={{damping: 1, stiffness: 750, duration: delay / 1000}}
      ref={ref}
    >
      <ConversationContent content={content}/>
    </motion.div>
  </React.Fragment>
}

export function ConversationsPage() {
  
  
  const convo = useCurrentConversation()
  const contentCards = [] as ReactNode[]
  
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollUserInputPageLayout sections={[]}>
          <div className={clsx(
            "flex flex-col gap-y-4 py-1",
            "border-neutral-100 dark:border-neutral-800",
          )}>
            <AnimatePresence>
              {
                convo.content.map(content => (
                    <motion.div
                      className={clsx(
                        "border-b-2 border-neutral-100 dark:border-neutral-800",
                      )}
                      transition={{duration: 10 / 1000}}
                      key={content.id}
                    >
                      <ConversationContent content={content}/>
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
