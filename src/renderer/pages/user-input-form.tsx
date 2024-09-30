import {useCurrentConversation} from '../hooks/current-conversation'
import {useAppDispatch, useAppSelector} from '../features/store'
import React, {ChangeEvent, KeyboardEventHandler, useCallback, useState} from 'react'
import {createContent} from '../../models/content'
import {appendContent, setResponder, streamResponse} from '../features/chat'
import {Responder, TModel} from '../../models/responder'
import {Field, Input, Select} from '@headlessui/react'
import clsx from 'clsx'
import {cardEffect} from '../wrapper/card'

export function UserInputForm() {
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
    if (e.key === 'Enter' && !e.shiftKey && value && conversation.responder) {
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
  
  return <Field className={"flex w-full flex-row-reverse gap-x-2 bottom-2 ml-auto"}>
    <Input
      className={clsx(
        cardEffect,
        'leading-relaxed text-xl flex bg-neutral-50/90 shadow-2xl dark:shadow-neutral-800 dark:hover:shadow-black/55 border-0 w-full mt-auto',
      )}
      onKeyUpCapture={handleKeyPress}
      value={promptMessage}
      onChange={handleOnChange}
    >
    </Input>
    
    <Select
      name={"responder"}
      aria-label={"responder"}
      className={clsx(cardEffect, "leading-relaxed text flex bg-neutral-50/90 shadow-2xl dark:shadow-none z-1 border")}
      value={conversation?.responder?.model}
      onChange={handleModelChange}
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
  </Field>
}
