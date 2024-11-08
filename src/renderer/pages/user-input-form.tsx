import { useCurrentConversation } from "../hooks/current-conversation"
import { useAppDispatch, useAppSelector } from "../features/store"
import React, {
  ChangeEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState
} from "react"
import { createContent } from "../../models/content"
import { appendContent, setResponder, streamResponse } from "../features/chat"
import { Responder, TModel } from "../../models/responder"
import { Field, Input, Select } from "@headlessui/react"
import clsx from "clsx"
import { cardEffect } from "../wrapper/card"

interface UserInputFormProps {
  disabled?: any
}

export function UserInputForm({ disabled }: UserInputFormProps) {
  const lazyRest = "REST"
  const conversation = useCurrentConversation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)
  const [promptMessage, setPromptMessage] = useState("")

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { value } = e.target as { value: string }
      if (!user?.username) {
        console.warn("log on first!")
        return
      }
      if (e.key === "Enter" && !e.shiftKey && value) {
        e.preventDefault()
        const prompt = createContent(
          value,
          conversation.id,
          user?.username,
          "user"
        )
        dispatch(appendContent(prompt))
        dispatch(streamResponse({ conversationId: conversation.id }))
        setPromptMessage("")
      }
    },
    [conversation, user]
  )
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPromptMessage(e.target.value)
    },
    [setPromptMessage]
  )
  const models = useAppSelector((state) => state.models.models)
  const ollamaModels = useAppSelector((state) => state.models.ollamaModels)
  const tools = useAppSelector((state) => state.tools)
  const handleModelChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const model = e.target.value as TModel | string
      if (model === lazyRest) {
        dispatch(
          setResponder({
            responder: {
              type: "organization",
              provider: "openai",
              model: model as TModel
            } satisfies Responder,
            chatId: conversation.id
          }),
        )
      } else {
        dispatch(
          setResponder({
            responder: {
              type: "chat",
              provider: ollamaModels.includes(model) ? "ollama" : "openai",
              model: model as TModel
            } satisfies Responder,
            chatId: conversation.id
          }),
        )
      }
    },
    [conversation]
  )

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
      console.log("nextModel", nextModel)
      dispatch(
        setResponder({
          responder: {
            type: "chat",
            provider: ollamaModels.includes(nextModel) ? "ollama" : "openai",
            model: nextModel
          } satisfies Responder,
          chatId: conversation.id
        }),
      )
    }
  }, [models, conversation])

  return (
    <Field className={"flex w-full flex-row-reverse gap-x-2 bottom-2 ml-auto"}>
      {!disabled && (
        <Input
          className={clsx(
            cardEffect,
            "leading-relaxed text-xl flex bg-neutral-100/90 dark:bg-neutral-950 border-0 w-full mt-aut flex-grow"
          )}
          onKeyUpCapture={handleKeyPress}
          value={promptMessage}
          onChange={handleOnChange}
          disabled={disabled}
        ></Input>
      )}
      
      {!disabled && (
        <Select
          name={"responder"}
          aria-label={"responder"}
          className={clsx(
            cardEffect,
            "leading-relaxed text flex bg-neutral-100/90 dark:bg-neutral-950 z-1 border max-w-50 flex-shrink"
          )}
          value={conversation?.responder?.model}
          onChange={handleModelChange}
          disabled={disabled}
        >
          {models?.map((model) => (
            <option value={model} key={model}>
              {model}
            </option>
          ))}
          {ollamaModels?.map((model) => (
            <option value={model} key={model}>
              {model}
            </option>
          ))}
          {Object.keys(tools.api).length > 0 && (
            <option value={lazyRest}>Lazy Rest</option>
          )}
        </Select>
      )}
    </Field>
  )
}
