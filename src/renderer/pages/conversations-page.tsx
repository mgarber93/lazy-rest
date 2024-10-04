import React, {ReactNode, RefObject, useCallback, useEffect, useRef} from 'react'
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

// sections.at(-1)?.ref
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
  const conversation = useCurrentConversation()
  const refs = Array.from({length: 256}, () => useRef(null))
  const sections = [] as ISection[]
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
  
  const contentCards = [] as ReactNode[]
  conversation.content
    .reduce((acc: AuthoredContent[], content: AuthoredContent, index: number) => {
      if (acc.length === 0) {
        return [content]
      }
      if (acc.length === 1) {
        sections.push(
          {
            id: v4(),
            ref: refs[index-1],
            label: `${acc[0].author} asks ${content.author}`,
          } satisfies ISection,
          {
            id: v4(),
            ref: refs[index],
            label: `${content.author} answers ${acc[0].author}`,
          } satisfies ISection,
        )
        contentCards.push(
          <motion.div
            className={clsx(
              "p-4 border-4 border-neutral-100 dark:border-neutral-800 rounded-2xl",
            )}
            whileHover={{borderColor: 'white/5'}}
            transition={{duration: delay / 1000}}
          >
            <MapContentToCardSection content={acc[0]} ref={sections[index - 1].ref as RefObject<HTMLDivElement>}/>
            <MapContentToCardSection content={content} ref={sections[index]?.ref as RefObject<HTMLDivElement>}/>
          </motion.div>,
        )
        return []
      }
      return acc
    }, [])
  
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollUserInputPageLayout sections={sections}>
          <div className={clsx(
            "flex flex-col gap-y-4 p-4",
            "border-neutral-100 dark:border-neutral-800",
          )}>
            <AnimatePresence>
              {
                ...contentCards
              }
            </AnimatePresence>
          </div>
        </ScrollUserInputPageLayout>
      </div>
    </HeaderLayout>
  )
}
