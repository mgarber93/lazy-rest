import React from 'react'
import clsx from 'clsx'
import {Field, Input, Label} from '@headlessui/react'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {Card} from '../wrapper/card'
import {transparent} from '../utils/transparent'

export function ConversationsPage() {
  const sectionRefs = {
  }
  const conversation = useCurrentConversation()
  return (
    <HeaderLayout>
      <div className={clsx("w-full h-full")}>
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <div className={clsx(
            "flex flex-col gap-y-4",
            "h-full",
          )}>
            {
              conversation.content.map(content => (
                <Card
                  className={clsx('w-full leading-relaxed text-xl flex')}
                  key={content.id}
                >
                  <span className={content.role === "user" ? "ml-auto" : ""}>{content.message}</span>
                </Card>
              ))
            }
            <div className={clsx("mt-auto")}>
              <Field className={"flex w-full flex-col gap-y-4 bottom-2 ml-auto pt-4"}>
                <Label className={"ml-auto text-xs"}>
                  <span className={"border rounded-xl p-2 cursor-pointer bg-black/5"}>Send message</span>
                </Label>
                <Input
                  className={clsx('leading-relaxed text-xl flex bg-zinc-50/90 shadow-2xl z-1 dark:bg-white/5 border-0 rounded-xl px-4 w-auto grow-0')}
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
