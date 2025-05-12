import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import clsx from 'clsx'
import {ApiCallPlan, HttpRequestPlan} from '../../models/api-call-plan'
import {KeyValueForm} from './key-value-form'
import {AuthForm} from './auth-form'
import {useCallback, useEffect, useState} from 'react'
import {AppButton} from '../components/app-button'
import {toast} from 'sonner'
import {useAppDispatch} from '../features/store'
import {updateStep, UpdateStepActivityPayload} from '../features/chat'

const tabs = [
  'Params',
  'Headers',
  'Body',
  'Authorization',
]

export interface HttpCallDetailComponentProps {
  apiCallPlan: ApiCallPlan,
  contentId: string,
  chatId: string
  index: number
}

export function HttpCallDetailComponent({apiCallPlan, chatId, contentId, index}: HttpCallDetailComponentProps) {
  const step = apiCallPlan.steps[index]?.step as HttpRequestPlan
  const dispatch = useAppDispatch()
  const [baseUrl, setBaseUrl] = useState<string>('')
  const [clientId, setClientId] = useState<string>('')
  const [clientSecret, setClientSecret] = useState<string>('')
  useEffect(() => {
    try {
      const api = JSON.parse(localStorage.tools).api
      const keys = Object.keys(api)
      const first = api[keys[0]]
      setBaseUrl(first.baseUrl)
      setClientId(first.clientId)
      setClientSecret(first.clientSecret)
    } catch (e) {
      console.warn('restoring failed')
    }
  }, [setBaseUrl, setClientId, setClientSecret])
  const [valid, setValid] = useState<boolean>(baseUrl !== '' && clientId !== '' && clientSecret !== '')
  const handleApiChange = useCallback((baseUrl: string, clientId: string, clientSecret: string) => {
    setBaseUrl(baseUrl)
    setClientId(clientId)
    setClientSecret(clientSecret)
    const nextIsValid = baseUrl !== '' && clientId !== '' && clientSecret !== ''
    setValid(nextIsValid)
  }, [setBaseUrl, setClientId, setClientSecret, setValid])
  const handleGetToken = useCallback(async () => {
    const buffer = btoa(`${clientId}:${clientSecret}`)
    const response = await window.main.fetch({
      httpVerb: "POST",
      headers: {
        'Authorization': 'Basic ' + buffer,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: baseUrl,
      body: 'grant_type=client_credentials',
    } satisfies HttpRequestPlan)
    const access_token = response.data.access_token
    if (!access_token) {
      toast.error('Failed to get token')
      return
    }
    dispatch(updateStep({
      chatId: chatId,
      contentId: contentId,
      nextPlan: {
        ...step,
        headers: {
          ...(step?.headers ?? {}),
          'Authorization': `Bearer ${access_token}`,
        },
      } as Partial<HttpRequestPlan>,
      sequenceId: index,
    } satisfies UpdateStepActivityPayload))
  }, [baseUrl, step, chatId])
  
  const saveHandler = useCallback(() => {
    if (!valid) {
      return
    }
    const api = JSON.parse(localStorage.tools).api
    const keys = Object.keys(api)
    const updatedApi = {
      ...api,
      [keys[0]]: {
        ...api[keys[0]],
        baseUrl,
        clientId,
        clientSecret,
      },
    }
    localStorage.setItem('tools', JSON.stringify({api: updatedApi}))
    toast.success('API configuration updated successfully')
  }, [valid, baseUrl, clientId, clientSecret])

  return (
    <TabGroup className={"flex w-full flex-col bg-white/25 dark:bg-transparent rounded mb-1"}>
      <TabList
        className="flex gap-4 content-around rounded-t w-full justify-center py-1 border-b border-black/15 dark:border-white/25">
        {tabs.map((name) => (
          <Tab
            key={name}
            className={clsx(
              "rounded-xl py-1 px-3 text-sm/6 font-semibold border border-transparent dark:text-neutral-400",
              "bg-black/5 data-[selected]:bg-black/10 data-[selected]:text-black data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10",
              "focus:outline-none data-[selected]:border data-[selected]:dark:bg-black/25 ",
              "data-[selected]:dark:border-white/1",
              "data-[hover]:dark:bg-black/50 data-[selected]:data-[hover]:dark:bg-black/50",
              "data-[focus]:outline-1 data-[focus]:dark:outline-white data-[selected]:dark:text-neutral-200",
            )}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="">
        <TabPanel key={'Params'} className="rounded p-3">
          <KeyValueForm data={(step?.queryParams ?? {}) as Record<string, unknown>}/>
        </TabPanel>
        <TabPanel key={'Headers'} className="rounded p-3">
          <KeyValueForm data={(step?.headers ?? {}) as Record<string, unknown>}/>
        </TabPanel>
        <TabPanel key={'Body'} className="rounded p-3">
          <KeyValueForm data={(step?.body as object ?? {}) as Record<string, unknown>}/>
        </TabPanel>
        <TabPanel key={'Authorization'} className="rounded p-3">
          <div className={"flex flex-col gap-2"}>
            <AuthForm baseUrl={baseUrl} clientId={clientId} clientSecret={clientSecret} onSave={handleApiChange} />
            <div className={"flex flex-row gap-2"}>
              <AppButton onClick={saveHandler} disabled={!valid}>Save</AppButton>
              <AppButton className={"ml-auto"} onClick={handleGetToken} disabled={!valid}>Get Token</AppButton>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  )
}
