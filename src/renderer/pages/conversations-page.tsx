import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollUserInputPageLayout} from '../layouts/scroll-container'
import {AuthoredContent} from '../../models/content'
import {FeedContent} from '../components/feed-content'
import {CardSection} from '../wrapper/card'

export function ConversationContent({content}: { content: AuthoredContent }) {
  if (content.apiCallPlan) {
    return <FeedContent/>
  } else {
    return <div
      className={clsx(
        'leading-relaxed text-xl flex flex-col px-2 py-1 transition duration-300',
        content.role === "user" && "ml-auto w-fit",
      )}
    >
      {
        content.role === "user" && <CardSection>
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
  const [sectionRefs, setSectionRefs] = useState<Record<string, MutableRefObject<HTMLDivElement | null>>>({
    'Query': useRef(null),
    'Response': useRef(null),
    'New Prompt': useRef(null),
  })
  
  const scrollToSection = useCallback((section: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sectionRefs[section]?.current?.scrollIntoView({alignToTop: true})
  }, [sectionRefs])
  
  useEffect(() => {
    scrollToSection('New Prompt')
  }, [conversation])
  
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollUserInputPageLayout sectionRefs={sectionRefs}>
          <div className={clsx(
            "flex flex-col",
            "border-zinc-100 dark:border-zinc-800",
          )}>
            {
              conversation.content.map((content, index) =>
                <div key={index} ref={sectionRefs[index % 2 === 0 ? 'Query' : 'Response']}>
                  <ConversationContent content={content} key={index}/>
                </div>,
              )
            }
          </div>
        
        </ScrollUserInputPageLayout>
      </div>
    </HeaderLayout>
  )
}
