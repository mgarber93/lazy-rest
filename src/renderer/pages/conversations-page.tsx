import React from 'react'
import clsx from 'clsx'
import {Field, Input, Label} from '@headlessui/react'

import {HeaderLayout} from '../layouts/header-layout'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ScrollPageLayout} from '../wrapper/scroll-container'

export function ConversationsPage() {
  const sectionRefs = {
  }
  const conversation = useCurrentConversation()
  return (
    <HeaderLayout>
      <div className="w-full h-full">
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <div className="flex flex-col gap-y-4">
            {
              conversation.content.map(content => (
                <div
                  className={clsx('w-full leading-relaxed text-xl flex')}
                  key={content.id}
                >
                  <span className={content.role === "user" ? "ml-auto" : ""}>{content.message}</span>
                </div>
              ))
            }
            <Field className={"flex w-full flex-col gap-y-2 bottom-2 ml-auto pt-14"}>
              <Label className={"ml-auto text-xs"}>
                Send message
              </Label>
              <Input
                className={clsx('leading-relaxed text-xl flex bg-white/5 border-0 rounded-xl px-4 w-auto grow-0')}
                style={{width: 'auto'}}
              >
              </Input>
            </Field>
          </div>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
