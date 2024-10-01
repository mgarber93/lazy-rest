import React, {RefObject, useCallback, useEffect, useRef} from 'react'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {v4} from 'uuid'
import {AnimatePresence, motion} from "framer-motion"

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ISection, ScrollUserInputPageLayout} from '../layouts/scroll-container'
import {AuthoredContent} from '../../models/content'
import {FeedContent} from '../components/feed-content'
import {CardSection} from '../wrapper/card'

export function ConversationContent({content}: { content: AuthoredContent }) {
  if (content.apiCallPlan) {
    return <FeedContent contentId={content.id} apiCallPlan={content.apiCallPlan}/>
  } else {
    return <div
      className={clsx(
        'leading-relaxed text-xl flex flex-col py-1 transition duration-300',
        content.role === "user" && "ml-auto w-fit",
      )}
    >
      {
        content.role === "user" && <CardSection className={"dark:bg-amber-800/5"}>
              <span
                className={clsx('flex-1')}
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

export function ConversationsPage() {
  const conversation = useCurrentConversation()
  const refs = Array.from({length: 256}, () => useRef(null))
  const sections = [
    ...conversation.content.map((c, i) => (
      {
        id: v4(),
        ref: refs[i],
        label: `${c.role}: ${c.author.padStart(20, "")}`,
      } satisfies ISection)),
    {
      id: v4(),
      ref: refs[conversation.content.length],
      label: 'New',
    },
  ]
  const scrollToSection = useCallback((section: RefObject<HTMLDivElement | null>) => {
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    section?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }, [])
  
  const delay = 10
  
  useEffect(() => {
    const nextSection = sections.at(-1)?.ref
    if (nextSection) {
      setTimeout(() => nextSection && scrollToSection(nextSection), delay)
    }
  }, [conversation])
  
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollUserInputPageLayout sections={sections}>
          <div className={clsx(
            "flex flex-col",
            "border-neutral-100 dark:border-neutral-800",
          )}>
            <AnimatePresence>
              {
                conversation.content.map((content, index) => <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0, height: 0}}
                    key={content.id}
                    transition={{damping: 1, stiffness: 750, duration: delay / 1000}}
                    ref={sections.at(-1)?.ref}
                  >
                  <ConversationContent content={content} key={index}/>
                  </motion.div>,
                )
              }
            </AnimatePresence>
          </div>
        </ScrollUserInputPageLayout>
      </div>
    </HeaderLayout>
  )
}
