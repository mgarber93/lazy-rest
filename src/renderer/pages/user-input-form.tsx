import {Field, Input} from '@headlessui/react'
import clsx from 'clsx'
import React, {ChangeEvent, KeyboardEventHandler, useCallback, useEffect, useState} from 'react'
import {ComputerDesktopIcon, PaperAirplaneIcon, WrenchIcon} from '@heroicons/react/24/outline'

import {useCurrentConversation} from '../hooks/current-conversation'
import {useAppDispatch, useAppSelector} from '../features/store'
import {createContent} from '../../models/content'
import {appendContent, setResponder, streamResponse} from '../features/chat'
import {Responder, TModel, TProvider} from '../../models/responder'
import {AppCombobox, ComboSelectable} from '../components/app-combobox'
import {selectAllApiConfigurations} from '../features/tools'
import {ProviderSelector} from '../components/provider-selector'

export interface UserInputFormProps {
  disabled?: boolean,
  classList?: string
}

export function UserInputForm({disabled, classList}: UserInputFormProps) {
  const conversation = useCurrentConversation()
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [promptMessage, setPromptMessage] = useState('')
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<TProvider>(conversation.responder?.provider || 'openai')
  const [selectedTools, setSelectedTools] = useState<string[]>(conversation.responder?.tools || [])
  const [showToolSelector, setShowToolSelector] = useState(false)

  const sendMessage = useCallback(() => {
    if (!user?.username) {
      console.warn('log on first!')
      return
    }
    if (promptMessage) {
      const prompt = createContent(promptMessage, conversation.id, user?.username, 'user')
      dispatch(appendContent(prompt))
      dispatch(streamResponse({conversationId: conversation.id}))
      setPromptMessage('')
    }
  }, [conversation, user, promptMessage, dispatch])

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const {value} = e.target as { value: string }
    if (e.key === 'Enter' && !e.shiftKey && value) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])
  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPromptMessage(e.target.value)
  }, [setPromptMessage])

  const handleProviderChange = useCallback((provider: TProvider) => {
    setSelectedProvider(provider)

    // Update the responder with the new provider
    if (conversation.responder) {
      dispatch(setResponder({
        responder: {
          ...conversation.responder,
          provider,
        },
        chatId: conversation.id,
      }))
    }
  }, [conversation, dispatch])

  const handleToolToggle = useCallback((toolId: string) => {
    const updatedTools = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId]

    setSelectedTools(updatedTools)

    // Update the responder with the new tools
    if (conversation.responder) {
      dispatch(setResponder({
        responder: {
          ...conversation.responder,
          tools: updatedTools,
        },
        chatId: conversation.id,
      }))
    }
  }, [conversation, dispatch, selectedTools])
  const models = useAppSelector((state) => state.models.models)
  const ollamaModels = useAppSelector(state => state.models.ollamaModels)
  const bedrockModels = useAppSelector(state => state.models.bedrockModels)
  const handleModelChange = useCallback((model: ComboSelectable) => {
    if (!model) {
      return
    }
    const modelName = model.name as TModel | string
    dispatch(setResponder({
      responder: {
        type: 'chat',
        provider: selectedProvider,
        model: modelName as TModel,
        tools: selectedTools,
      } satisfies Responder,
      chatId: conversation.id,
    }))
  }, [conversation, selectedProvider, selectedTools])

  useEffect(() => {
    const model = conversation.responder?.model
    if (!model && models.length > 0) {
      const nextModel = [...ollamaModels, ...bedrockModels, ...models].at(0) as TModel

      let provider: TProvider = 'openai'
      if (ollamaModels.includes(nextModel)) {
        provider = 'ollama'
      } else if (bedrockModels.includes(nextModel)) {
        provider = 'bedrock'
      }

      setSelectedProvider(provider)
      setSelectedTools(conversation.responder?.tools || [])

      dispatch(setResponder({
        responder: {
          type: 'chat',
          provider,
          model: nextModel,
          tools: conversation.responder?.tools || [],
        } satisfies Responder,
        chatId: conversation.id,
      }))
    } else if (model) {
      setSelectedProvider(conversation.responder?.provider || 'openai')
      setSelectedTools(conversation.responder?.tools || [])
    }
  }, [models, ollamaModels, bedrockModels, conversation])

  // Get all available tools
  const apiConfigurations = useAppSelector(selectAllApiConfigurations)

  // Convert models to ComboSelectable format for AppCombobox
  const getModelsForProvider = useCallback((): ComboSelectable[] => {
    let modelList: string[] = []

    if (selectedProvider === 'openai') {
      modelList = models
    } else if (selectedProvider === 'ollama') {
      modelList = ollamaModels
    } else if (selectedProvider === 'bedrock') {
      modelList = bedrockModels
    }

    return [
      ...modelList.map((model, index) => ({id: index + 1, name: model})),
    ]
  }, [models, ollamaModels, bedrockModels, selectedProvider])

  // Find the current model as ComboSelectable
  const getCurrentModel = useCallback((): ComboSelectable => {
    const currentModel = conversation.responder?.model || ''
    const modelOptions = getModelsForProvider()
    return modelOptions.find(option => option.name === currentModel) || modelOptions[0]
  }, [conversation.responder?.model, getModelsForProvider])

  return <Field
    className={clsx("flex w-full", classList)}>
    <div className="relative flex w-full">
      <div className="w-full flex items-center rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2 py-1">
        {/* Left side icons */}
        <div className="flex items-center space-x-2 mr-2">
          {/* Provider selector */}
          <ProviderSelector 
            selectedProvider={selectedProvider} 
            onProviderChange={handleProviderChange} 
          />

          {/* Model selector toggle button */}
          <button
            className={clsx(
              "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
              showModelSelector && "text-blue-500 dark:text-blue-400",
            )}
            onClick={() => setShowModelSelector(!showModelSelector)}
            title="Select Model"
          >
            <ComputerDesktopIcon className="h-5 w-5"/>
          </button>

          {/* Tool button */}
          <button
            className={clsx(
              "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
              selectedTools.length > 0 && "text-purple-500 dark:text-purple-400",
            )}
            onClick={() => setShowToolSelector(!showToolSelector)}
            title="Add Tools"
          >
            <WrenchIcon className="h-5 w-5"/>
          </button>
        </div>

        {/* Input field */}
        <Input
          className={clsx(
            'flex-1 border-none bg-transparent dark:text-white focus:outline-none',
          )}
          onKeyUpCapture={handleKeyPress}
          value={promptMessage}
          onChange={handleOnChange}
          disabled={disabled}
        />

        {/* Send button */}
        <button
          className="ml-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          onClick={sendMessage}
          title="Send Message"
        >
          <PaperAirplaneIcon className="h-5 w-5"/>
        </button>
      </div>

      {/* Model selector */}
      <div className="absolute left-0 bottom-full mb-2">
        {showModelSelector && (
          <div
            className="w-64 rounded border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 p-2">
            <AppCombobox
              options={getModelsForProvider()}
              onChange={handleModelChange}
              initialSelected={getCurrentModel()}
            />
          </div>
        )}
      </div>

      {/* Tool selector */}
      {showToolSelector && (
        <div
          className="absolute right-0 bottom-full mb-2 w-64 rounded border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 p-2">
          <div className="text-sm font-medium mb-2 dark:text-white">Available Tools</div>
          {apiConfigurations.length === 0 ? (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">No tools available</div>
          ) : (
            <div className="space-y-2">
              {apiConfigurations.map((api) => (
                <div key={api.fileHandle} className="flex items-center">
                  <input
                    type="checkbox"
                    id={api.fileHandle}
                    checked={selectedTools.includes(api.fileHandle)}
                    onChange={() => handleToolToggle(api.fileHandle)}
                    className="mr-2"
                  />
                  <label htmlFor={api.fileHandle} className="text-sm dark:text-white">{api.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </Field>
}
