import {AuthoredContent} from '../../models/content'
import {FeedContent} from './feed-content'
import clsx from 'clsx'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React from 'react'

export function ConversationContent({content, chatId}: { content: AuthoredContent, chatId: string }) {
  if (content.apiCallPlan) {
    return <FeedContent contentId={content.id} apiCallPlan={content.apiCallPlan} chatId={chatId}/>
  } else {
    return <div
      className={clsx(
        'leading-relaxed text-xl flex flex-col py-1 transition duration-300 dark:border-white/50 rounded-xl',
        content.role === "user" && "ml-auto w-fit",
      )}
    >
      {
        content.role === "user" &&
        <span
          className={clsx('flex-1 text-right flex ml-auto dark:text-neutral-300 lg:pt-16')}
          key={content.id}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
        </span>
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
