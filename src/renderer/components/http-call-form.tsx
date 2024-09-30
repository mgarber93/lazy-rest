import clsx from 'clsx'
import {Input, Select} from '@headlessui/react'
import {AppButton} from './app-button'
import React, {useCallback} from 'react'
import {HttpCallDetailComponent} from '../wrapper/http-call-detail-component'
import {useCurrentConversation} from '../hooks/current-conversation'
import {HttpRequestPlan} from '../../models/api-call-plan'
import {updateStep, UpdateStepActivityPayload} from '../features/chat'
import {useAppDispatch} from '../features/store'

export interface HttpCallFormProps {
  step?: Partial<HttpRequestPlan>,
  contentId: string,
  sequenceId: number
}

export function HttpCallForm({step, contentId, sequenceId}: HttpCallFormProps) {
  const elements = `border rounded-xl bg-transparent border-neutral-700`
  const inputClass = clsx(
    elements,
    'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
  )
  const convo = useCurrentConversation()
  const dispatch = useAppDispatch()
  const handleSendClick = useCallback(() => {
    console.log('handleSendClick')
  }, [convo])
  // dispatch update step when select and input changes to update step
  
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
  
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  
  return <div className={clsx('flex flex-col gap-1 mt-1')}>
    <div className={"flex flex-row gap-2"}>
      <Select
        name="status"
        className={clsx(
          elements,
          "h-full bg-transparent data-[hover]:shadow data-[focus]:bg-black-100",
        )}
        aria-label="Project status"
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
        onChange={handleInputChange}
      />
      <AppButton
        className={clsx(elements, "px-2 border-neutral-500")}
        onClick={handleSendClick}
      >
        Send
      </AppButton>
    </div>
    <HttpCallDetailComponent step={step}/>
  </div>
}
