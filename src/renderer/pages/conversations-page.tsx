import React, {ChangeEvent, KeyboardEventHandler, MutableRefObject, useCallback, useState} from 'react'
import clsx from 'clsx'
import {Field, Input} from '@headlessui/react'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {Card} from '../wrapper/card'
import {useAppDispatch, useAppSelector} from '../features/store'
import {cardEffect} from '../utils/card'
import {respond, streamResponse} from '../features/chat'
import {createContent} from '../../models/content'
import {User} from '../../models/user'

export function ConversationsPage() {
  const conversation = useCurrentConversation()
  const user = useAppSelector((state) => state.user) as User
  const [sectionRefs] = useState<Record<string, MutableRefObject<HTMLDivElement | null>>>({})
  const [value, setValue] = useState('')
  const dispatch = useAppDispatch()
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {value} = e.target as { value: string }
    if (e.key === 'Enter' && !e.shiftKey && value && conversation.responder) {
      e.preventDefault()
      const prompt = createContent(value, conversation.id, user.username, 'user')
      dispatch(respond(prompt))
      dispatch(streamResponse({conversationId: conversation.id}))
      setValue('')
    }
  }, [conversation, user])
  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [setValue])
  
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <div className={clsx(
            "flex flex-col gap-y-4",
            "h-full",
          )}>
            {
              conversation.content.map((content, index) => (
                <Card
                  className={clsx('w-full leading-relaxed text-xl flex flex-col bg-zinc-50')}
                  key={index}
                >
                  <span
                    className={clsx('flex-1', content.role === "user" ? "ml-auto" : "")}
                    key={content.id}
                  >
                    {content.message}
                  </span>
                </Card>
              ))
            }
            <div className={clsx("mt-auto")}>
              <Field className={"flex w-full flex-col gap-y-4 bottom-2 ml-auto pt-4"}>
                <Input
                  className={clsx(
                    cardEffect,
                    'leading-relaxed text-xl flex bg-zinc-50/90 shadow-2xl z-1 border-0 w-auto',
                  )}
                  style={{width: 'auto'}}
                  onKeyUpCapture={handleKeyPress}
                  value={value}
                  onChange={handleOnChange}
                >
                </Input>
              </Field>
            </div>
          </div>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
