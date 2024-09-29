import React, {MutableRefObject, useState} from 'react'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {Card} from '../wrapper/card'
import {AuthoredContent} from '../../models/content'
import {FeedContent} from '../components/feed-content'
import {UserInputForm} from './user-input-form'

export function ConversationContent({content}: { content: AuthoredContent }) {
  if (content.apiCallPlan) {
    return <FeedContent/>
  } else {
    return <Card
      className={clsx(
        'leading-relaxed text-xl flex flex-col bg-zinc-50',
        content.role === "user" && "ml-auto",
      )}
    >
      <span
        className={clsx('flex-1')}
        key={content.id}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
      </span>
    </Card>
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
            "flex flex-col gap-y",
            "h-full",
          )}>
            {
              conversation.content.map((content, index) => <ConversationContent content={content} key={index}/>)
            }
            <div className={clsx("mt-auto")}>
              <UserInputForm/>
            </div>
          </div>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
