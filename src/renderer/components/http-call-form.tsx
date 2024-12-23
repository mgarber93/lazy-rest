import clsx from 'clsx'
import {Input, Select} from '@headlessui/react'
import {AppButton} from './app-button'
import React, {useCallback} from 'react'
import {HttpCallDetailComponent} from '../wrapper/http-call-detail-component'
import {useCurrentConversation} from '../hooks/current-conversation'
import {HttpRequestPlan, HttpResponse} from '../../models/api-call-plan'
import {updateStep, UpdateStepActivityPayload} from '../features/chat'
import {useAppDispatch} from '../features/store'
import {JsonViewer} from './json-viewer'


export interface HttpCallFormProps {
  step: Partial<HttpRequestPlan>,
  contentId: string,
  sequenceId: number
}

/**
 *
 * @param step
 * @param contentId
 * @param sequenceId
 * @constructor
 */
export function HttpCallForm({step, contentId, sequenceId}: HttpCallFormProps) {
  const elements = `border rounded bg-transparent border-neutral-700`
  const inputClass = clsx(
    elements,
    'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
  )
  const convo = useCurrentConversation()
  const [response, setResponse] = React.useState<HttpResponse | null>(null)
  const dispatch = useAppDispatch()
  const handleSendClick = useCallback(async () => {
    if (!step) {
      return
    }
    console.log('handleSendClick')
    const p = new URLSearchParams(step.queryParams as Record<string, string>)
    const qs = p.toString()
    const response = await window.main.fetch({
      url: step.url! + (qs ? `?${qs}` : '') ,
      httpVerb: step.httpVerb!,
      headers: step.headers!,
      body: step.body,
    } satisfies HttpRequestPlan)
    setResponse(response)
  }, [convo, setResponse])
  
  const handleContinue = useCallback(() => {
    console.log('handleContinue')
  }, [])
  
  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    dispatch(updateStep({
      chatId: convo.id,
      contentId: contentId,
      nextPlan: {
        ...step,
        httpVerb: selectedValue,
      } as Partial<HttpRequestPlan>,
      sequenceId,
    } satisfies UpdateStepActivityPayload))
  }, [convo])
  
  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    dispatch(updateStep({
      chatId: convo.id,
      contentId: contentId,
      nextPlan: {
        ...step,
        url: inputValue,
      } as Partial<HttpRequestPlan>,
      sequenceId,
    } satisfies UpdateStepActivityPayload))
  }, [convo, contentId, sequenceId])
  
  return <div className={clsx('flex flex-col gap-0 font-mono')}>
    <div className={"flex flex-row gap-0"}>
      <Select
        name="status"
        className={clsx(
          elements,
          "h-full bg-transparent data-[hover]:shadow data-[focus]:bg-black-100",
        )}
        defaultValue={step?.httpVerb}
        onChange={handleSelectChange}
      >
        <option value="GET">Get</option>
        <option value="POST">Post</option>
        <option value="PUT">Put</option>
        <option value="DELETE">Delete</option>
      </Select>
      <Input
        className={inputClass}
        defaultValue={step?.url}
        onChange={handleUrlChange}
      />
    </div>
    <HttpCallDetailComponent step={step}/>
    <div className={"w-full grid pt-4 pb-1"}>
      <AppButton
        className={clsx(elements, "px-2 border-neutral-500 ml-auto")}
        onClick={handleSendClick}
      >
        {'Send'}
      </AppButton>
    </div>
    {
      response && <JsonViewer response={response}/>
    }
  </div>
}
