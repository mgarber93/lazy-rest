import React, {useEffect, useRef} from 'react'
import {HeaderLayout} from '../layouts/header-layout'
import {ApiForm} from '../wrapper/api-form'
import {OllamaForm, OpenAiForm} from '../wrapper/open-ai-form'
import {CardH2, CardH3, CardSection} from '../wrapper/card'
import {getMachineName} from '../features/user'
import {useAppDispatch, useAppSelector} from '../features/store'
import clsx from 'clsx'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const apis = useAppSelector(state => state.tools.api)
  const Ollama = useRef<HTMLDivElement>(null)
  const OpenAi = useRef<HTMLDivElement>(null)
  const BedRock = useRef<HTMLDivElement>(null)
  const ApiSpecifications = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    dispatch(getMachineName())
  }, [dispatch])
  const card = "bg-white dark:bg-neutral-900 rounded-lg shadow-lg"
  return (
    <HeaderLayout>
      <div className="w-full h-full">
        <div>
          <div ref={Ollama} className={clsx("min-h-[20rem] m-2 p-4", card)}>
            <CardH2>Ollama</CardH2>
            <div className="py-4">
              <OllamaForm/>
            </div>
          </div>
          
          <div ref={OpenAi} className={clsx("min-h-[20rem] m-2 p-4", card)}>
            <CardH2>Open AI</CardH2>
            <div className={"py-4"}>
              <OpenAiForm/>
            </div>
          </div>
          
          <div ref={BedRock} className={clsx("min-h-[20rem] m-2 p-4", card)}>
            <CardH2>AWS Bed Rock</CardH2>
            <div>todo</div>
          </div>
          
          <div ref={ApiSpecifications} className={clsx("min-h-[20rem] m-2 p-4", card)}>
            <CardH2>Api Specifications</CardH2>
          </div>
          {Object.keys(apis).length > 0 && <CardSection>
            <div className={"flex flex-col"}>
              {
                Object.keys(apis).map((key) => <div className={"my-4"} key={key}>{apis[key].name}</div>)
              }
            </div>
          </CardSection>
          }
          <CardSection>
            <CardH3>Use api specification info</CardH3>
            <ApiForm/>
          </CardSection>
        </div>
      </div>
    </HeaderLayout>
  )
}
