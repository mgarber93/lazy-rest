import React, {useEffect} from 'react'
import {HeaderLayout} from '../layouts/header-layout'
import {OllamaForm, OpenAiForm} from '../wrapper/open-ai-form'
import {CardH2} from '../wrapper/card'
import {getMachineName} from '../features/user'
import {useAppDispatch} from '../features/store'
import clsx from 'clsx'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(getMachineName())
  }, [dispatch])
  const card = "bg-white dark:bg-neutral-900 rounded-lg shadow-lg"
  return (
    <HeaderLayout>
      <div className={clsx("w-full min-h-full p-2 flex flex-col gap-4 overflow-scroll", "bg-neutral-100 dark:bg-neutral-800")}>
        <div className={clsx("min-h-[20rem] p-4", card)}>
          <CardH2>Ollama</CardH2>
          <div className="py-4">
            <OllamaForm/>
          </div>
        </div>
        
        <div className={clsx("min-h-[20rem] p-4", card)}>
          <CardH2>Open AI</CardH2>
          <div className={"py-4"}>
            <OpenAiForm/>
          </div>
        </div>
        
        <div className={clsx("min-h-[20rem] p-4", card)}>
          <CardH2>AWS Bed Rock</CardH2>
          <div>todo</div>
        </div>
      </div>
    </HeaderLayout>
  )
}
