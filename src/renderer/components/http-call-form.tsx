import clsx from 'clsx'
import {Input, Select} from '@headlessui/react'
import {AppButton} from './app-button'
import React, {useCallback, useState} from 'react'
import {HttpCallDetailComponent} from '../wrapper/http-call-detail-component'
import {useCurrentConversation} from '../hooks/current-conversation'
import {ApiCallPlan, HttpRequestPlan, ProgressStage, SummarizationJob} from '../../models/api-call-plan'
import {handleInterpret, updateStep, UpdateStepActivityPayload} from '../features/chat'
import {useAppDispatch} from '../features/store'
import {JsonViewer} from './json-viewer'
import {CardSection} from '../wrapper/card'
import {headerTransparencyEffect} from '../utils/transparent'
import {motion} from 'framer-motion'


export interface HttpCallFormProps {
  apiCallPlan: ApiCallPlan,
  contentId: string,
  chatId: string
  index: number
}


/**
 *
 * @param step
 * @param contentId
 * @param sequenceId
 * @constructor
 */
export function HttpCallForm({apiCallPlan, index, contentId, chatId}: HttpCallFormProps) {
  const activity = apiCallPlan.steps[index]
  const [isOpen, setIsOpen] = useState(activity.progressStage === ProgressStage.active)
  
  const step = activity.step as HttpRequestPlan
  const sequenceId = index
  
  const handleToggle = useCallback(() => {
    setIsOpen(isOpen => !isOpen)
  }, [isOpen, setIsOpen])
  
  const elements = `border rounded bg-transparent border-neutral-700`
  const inputClass = clsx(
    elements,
    'flex-grow py-1.5 px-3 text-sm/6 dark:text-white',
    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
  )
  const convo = useCurrentConversation()
  const dispatch = useAppDispatch()
  const handleSendClick = useCallback(async () => {
    if (!step) {
      return
    }
    console.log('handleSendClick')
    const p = new URLSearchParams(step.queryParams as Record<string, string>)
    const qs = p.toString()
    const response = await window.main.fetch({
      url: step.url! + (qs ? `?${qs}` : ''),
      httpVerb: step.httpVerb!,
      headers: step.headers!,
      body: step.body,
    } satisfies HttpRequestPlan)
    
    const nextPlan: Partial<HttpRequestPlan> = {
      ...step,
      queryParams: step.queryParams,
      headers: step.headers,
      body: step.body,
      httpVerb: step.httpVerb,
      url: step.url ?? '',
      response,
    }
    
    dispatch(updateStep({
      chatId: convo.id,
      contentId,
      sequenceId,
      nextPlan,
    }))
  }, [convo])
  
  const handleContinue = useCallback(async () => {
    await dispatch(handleInterpret({
      contentId,
      chatId,
      job: {
        apiCallPlan, index, contentId, chatId,
      } satisfies SummarizationJob,
    }))
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
  
  return (
    <>
      <CardSection className={clsx(
        headerTransparencyEffect,
        "flex flex-col gap-1 dark:bg-neutral-900",
        "rounded-none",
      )}>
        <div className={"h-full py-0 px-0 border-b border-neutral-100 dark:border-neutral-600"}>
          <div className={"flex flex-row text-nowrap gap cursor-pointer dark:text-neutral-300"} onClick={handleToggle}>
            <span
              className={"w-full max-w-14 text-left font-mono text-sm overflow-hidden align-center border-r border-neutral-100 dark:border-neutral-700 justify-self-center self-end"}>
              {(index ?? 0)}
            </span>
            <span
              className={"flex-grow text-wrap indent-6 pl-4 font-mono text-sm align-center select-none justify-self-center self-end"}>
          {activity.step?.name}
            </span>
          </div>
        </div>
        <motion.div
          initial={{height: 0}}
          animate={{height: isOpen ? 'auto' : 0}}
          transition={{duration: 0.2}}
          style={{overflow: 'hidden'}}
        >
          <div className={clsx('flex flex-col gap-0 font-mono')}>
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
            <HttpCallDetailComponent apiCallPlan={apiCallPlan} chatId={chatId} contentId={contentId} index={index}/>
          </div>
        </motion.div>
      </CardSection>
      {isOpen && <CardSection className={clsx(
        headerTransparencyEffect,
        "flex flex-col gap-1 dark:bg-neutral-900",
        "rounded-none",
      )}>
        {
          step.response && <JsonViewer response={step.response}/>
        }
        <div className={"w-full grid pt-4 pb-1"}>
          <div className={"flex flex-row gap-2"}>
            {step.response && <AppButton className={"mr-auto"} onClick={handleSendClick}>Retry</AppButton>}
            <AppButton
              className={clsx(elements, "px-2 border-neutral-500 ml-auto")}
              onClick={step.response ? handleContinue : handleSendClick}
            >
              {step.response ? 'Continue' : 'Send'}
            </AppButton>
          </div>
        </div>
      </CardSection>
      }
    </>
  )
}
