import {Field, Input} from '@headlessui/react'
import clsx from 'clsx'
import React, {ChangeEvent, KeyboardEventHandler, useCallback, useEffect, useState} from 'react'

import {useCurrentConversation} from '../hooks/current-conversation'
import {useAppDispatch, useAppSelector} from '../features/store'
import {createContent} from '../../models/content'
import {appendContent, setResponder, streamResponse} from '../features/chat'
import {Responder, TModel} from '../../models/responder'

export interface UserInputFormProps {
  disabled?: any,
  classList?: string
}

export function UserInputForm({disabled, classList}: UserInputFormProps) {
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
    if (!model && models.length > 0) {
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
  
  return <Field
    className={clsx("flex w-full", classList)}>
    <Input
      className={clsx(
        'w-full rounded-br-lg  light:focus:shadow-lg border-t-[0.5px] border-0 border-neutral-200 dark:border-neutral-600 focus:dark:border-neutral-600 dark:bg-neutral-800 dark:text-white',
      )}
      onKeyUpCapture={handleKeyPress}
      value={promptMessage}
      onChange={handleOnChange}
      disabled={disabled}
    >
    </Input>
  </Field>
}
