import React, {ChangeEvent, KeyboardEventHandler, MutableRefObject, useCallback, useState} from 'react'
import clsx from 'clsx'
import {Field, Input, Select} from '@headlessui/react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {Card, cardEffect} from '../wrapper/card'
import {useAppDispatch, useAppSelector} from '../features/store'
import {appendContent, setResponder, streamResponse} from '../features/chat'
import {AuthoredContent, createContent} from '../../models/content'
import {User} from '../../models/user'
import {Responder, TModel} from '../../models/responder'
import {FeedContent} from '../components/feed-content'

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
  const dispatch = useAppDispatch()
  const conversation = useCurrentConversation()
  const user = useAppSelector((state) => state.user) as User
  
  const lazyRest = "REST"
  
  const [sectionRefs] = useState<Record<string, MutableRefObject<HTMLDivElement | null>>>({})
  const [value, setValue] = useState('')
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {value} = e.target as { value: string }
    if (e.key === 'Enter' && !e.shiftKey && value && conversation.responder) {
      e.preventDefault()
      const prompt = createContent(value, conversation.id, user?.username, 'user')
      dispatch(appendContent(prompt))
      dispatch(streamResponse({conversationId: conversation.id}))
      setValue('')
    }
  }, [conversation, user])
  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [setValue])
  const models = useAppSelector((state) => state.models.models)
  const tools = useAppSelector((state) => state.tools)
  const handleModelChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value as TModel | string
    if (model === lazyRest) {
      dispatch(setResponder({
        responder: {
          type: 'organization',
          provider: 'openai',
          model: model as TModel,
        } satisfies Responder,
        chatId: conversation.id,
      }))
    } else {
      dispatch(setResponder({
        responder: {
          type: 'chat',
          provider: 'openai',
          model: model as TModel,
        } satisfies Responder,
        chatId: conversation.id,
      }))
    }
  }, [conversation])
  
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
              <Field className={"flex w-full flex-row-reverse gap-x-2 bottom-2 ml-auto pt-4"}>
                <Input
                  className={clsx(
                    cardEffect,
                    'leading-relaxed text-xl flex bg-zinc-50/90 shadow-2xl dark:shadow-zinc-800 dark:hover:shadow-zinc-600 border-0 w-full mt-auto',
                  )}
                  onKeyUpCapture={handleKeyPress}
                  value={value}
                  onChange={handleOnChange}
                >
                </Input>
                <Select
                  name={"responder"}
                  aria-label={"responder"}
                  className={clsx(cardEffect, "leading-relaxed text flex bg-zinc-50/90 shadow-2xl dark:shadow-none z-1 border-0")}
                  value={conversation?.responder?.model}
                  onChange={handleModelChange}
                >
                  {
                    models.map((model) => <option value={model} key={model}>{model}</option>)
                  }
                  {
                    Object.keys(tools.api).length > 0 && <option value={lazyRest}>Lazy Rest</option>
                  }
                </Select>
              </Field>
            </div>
          </div>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
