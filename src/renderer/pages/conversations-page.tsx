import React, {MutableRefObject, useState} from 'react'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {AuthoredContent} from '../../models/content'
import {FeedContent} from '../components/feed-content'
import {UserInputForm} from './user-input-form'
import {cardEffect} from '../wrapper/card'

export function ConversationContent({content}: { content: AuthoredContent }) {
  if (content.apiCallPlan) {
    return <FeedContent/>
  } else {
    return <div
      className={clsx(
        'leading-relaxed text-xl flex flex-col m-1 px-2 py-1 transition duration-300',
        content.role === "user" && "ml-auto",
      )}
    >
      <span
        className={clsx('flex-1')}
        key={content.id}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
      </span>
    </div>
  }
}

export function ConversationsPage() {
  const conversation = useCurrentConversation()
  const [sectionRefs] = useState<Record<string, MutableRefObject<HTMLDivElement | null>>>({})
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <div className={clsx(
            conversation.content.length && cardEffect,
            "flex flex-col gap-y",
            "h-fit",
            "border-l border-r border-zinc-100 px-4",
            "shadow-2xl shadow-zinc-300",
          )}>
            {
              conversation.content.map((content, index) => <ConversationContent content={content} key={index}/>)
            }
          </div>
          <div className={clsx("mt-auto")}>
            <UserInputForm/>
          </div>
        </ScrollPageLayout>
      
      </div>
    </HeaderLayout>
  )
}
