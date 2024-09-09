import React, {MutableRefObject, useCallback, useState} from 'react'
import clsx from 'clsx'
import {Button, Field, Input, Label} from '@headlessui/react'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {Card} from '../wrapper/card'
import {useAppDispatch} from '../features/store'
import {cardEffect} from '../utils/card'


export function ConversationsPage() {
  const conversation = useCurrentConversation()
  const [sectionRefs, setSectionRefs] = useState<Record<string, MutableRefObject<HTMLDivElement | null>>>({})
  const [pendingMessage, setPendingMessage] = useState('')
  const dispatch = useAppDispatch()
  const handleSubmit = useCallback(() => {
    // dispatch(respond())
  }, [pendingMessage])

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
                <Label className={"ml-auto text-xs"}>
                  <Button
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-md bg-zinc-50 dark:bg-zinc-700 py-1.5 px-3 text-sm/6 font-semibold shadow  shadow-black/10 dark:shadow-white/10 focus:outline-none data-[hover]:bg-zinc-100 dark:data-[hover]:bg-zinc-600 data-[open]:bg-zinc-700 data-[focus]:outline-1 data-[focus]:outline-white"
                    )}
                    onClick={handleSubmit}
                  >
                  Send message</Button>
                </Label>
                <Input
                  className={clsx(
                    cardEffect,
                    'leading-relaxed text-xl flex bg-zinc-50/90 shadow-2xl z-1 border-0 w-auto',
                  )}
                  style={{width: 'auto'}}
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
