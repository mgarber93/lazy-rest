import {HeaderLayout} from '../layouts/header-layout'
import clsx from 'clsx'
import React, {ChangeEvent, KeyboardEventHandler, useCallback, useEffect, useState} from 'react'
import {PlusGrid, PlusGridItem, PlusGridRow} from '../components/plus-grid'
import {Logo} from '../components/logo'
import {AppInput} from '../components/app-input'
import {cardEffect} from '../wrapper/card'
import {useCurrentConversation} from '../hooks/current-conversation'
import {useAppDispatch, useAppSelector} from '../features/store'
import {createContent} from '../../models/content'
import {appendContent, setResponder, streamResponse} from '../features/chat'
import {Responder, TModel} from '../../models/responder'

import {Field, Select} from '@headlessui/react'
import {HeaderProps} from '../wrapper/header'


export function NewChatPage() {
  const lazyRest = "REST"
  const conversation = useCurrentConversation()
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [promptMessage, setPromptMessage] = useState('')
  
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {value} = e.target as { value: string }
    if (!user?.username) {
      console.warn('log on first!')
      return
    }
    if (e.key === 'Enter' && !e.shiftKey && value) {
      e.preventDefault()
      const prompt = createContent(value, conversation.id, user?.username, 'user')
      dispatch(appendContent(prompt))
      dispatch(streamResponse({conversationId: conversation.id}))
      setPromptMessage('')
    }
  }, [conversation, user])
  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPromptMessage(e.target.value)
  }, [setPromptMessage])
  const models = useAppSelector((state) => state.models.models)
  const ollamaModels = useAppSelector(state => state.models.ollamaModels)
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
          provider: ollamaModels.includes(model) ? 'ollama' : 'openai',
          model: model as TModel,
        } satisfies Responder,
        chatId: conversation.id,
      }))
    }
  }, [conversation])
  
  useEffect(() => {
    const model = conversation.responder?.model
    // set model on page load if we don't have one and have options
    if (!model && models.length > 0) {
      // default to lazy rest when ready
      // dispatch(setResponder({
      //   responder: {
      //     type: 'organization',
      //     provider: 'openai',
      //     model: model as TModel,
      //   } satisfies Responder,
      //   chatId: conversation.id,
      // }))
      const nextModel = [...ollamaModels, ...models].at(0) as TModel
      console.log('nextModel', nextModel)
      dispatch(setResponder({
        responder: {
          type: 'chat',
          provider: ollamaModels.includes(nextModel) ? 'ollama' : 'openai',
          model: nextModel,
        } satisfies Responder,
        chatId: conversation.id,
      }))
    }
  }, [models, conversation])
  const parameters = {
    showSearch: true,
    showHistory: true,
    showConfig: false,
    historyCount: 10,
    historyLength: 10
  } satisfies HeaderProps
  return (
    <HeaderLayout layoutProps={parameters}>
      <Field className={clsx("w-full h-full p-10")}>
        <PlusGrid>
          <PlusGridRow className="relative flex justify-start">
            <PlusGridItem className="py-3 w-24">
              <></>
            </PlusGridItem>
            <PlusGridItem className="py-3 w-24">
              <Logo className="h-9"/>
            </PlusGridItem>
            <PlusGridItem className="relative flex w-32">
              <div className={"flex flex-col gap-1"}>
                <Select
                  name={"responder"}
                  aria-label={"responder"}
                  className={clsx(
                    cardEffect,
                    "leading-relaxed text flex bg-neutral-100/90 dark:bg-neutral-950 z-1 border max-w-50 flex-shrink",
                  )}
                  value={conversation?.responder?.model}
                  onChange={handleModelChange}
                  disabled={false}
                >
                  {
                    models?.map((model) => <option value={model} key={model}>{model}</option>)
                  }
                  {
                    ollamaModels?.map((model) => <option value={model} key={model}>{model}</option>)
                  }
                  {
                    Object.keys(tools.api).length > 0 && <option value={lazyRest}>Lazy Rest</option>
                  }
                </Select>
              </div>
            </PlusGridItem>
            <PlusGridItem className="relative flex flex-grow group">
              <AppInput type={"string"} value={""}
                        className={"rounded-none border-0 group-hover:bg-white/15"}/>
            </PlusGridItem>
            <PlusGridItem className="py-3 w-24">
              <></>
            </PlusGridItem>
          </PlusGridRow>
        </PlusGrid>
      </Field>
    </HeaderLayout>
  )
}
