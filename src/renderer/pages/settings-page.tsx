import React, {useEffect, useRef} from 'react'
import {HeaderLayout} from '../layouts/header-layout'
import {ApiForm} from '../wrapper/api-form'
import {ISection, ScrollPageLayout} from '../layouts/scroll-container'
import {OllamaForm, OpenAiForm} from '../wrapper/open-ai-form'
import {CardH2, CardH3, CardSection} from '../wrapper/card'
import {getMachineName} from '../features/user'
import {useAppDispatch, useAppSelector} from '../features/store'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const apis = useAppSelector(state => state.tools.api)
  const Ollama = useRef<HTMLDivElement>(null)
  const OpenAi = useRef<HTMLDivElement>(null)
  const BedRock = useRef<HTMLDivElement>(null)
  const ApiSpecifications = useRef<HTMLDivElement>(null)
  const configSections = [
    {
      ref: Ollama,
      id: "ollama",
      label: "Ollama",
    },
    {
      ref: OpenAi,
      id: "openai",
      label: "Open AI",
    },
    {
      ref: BedRock,
      id: "bedrock",
      label: "AWS Bed Rock",
    },
    {
      ref: ApiSpecifications,
      id: "apispecifications",
      label: "Api Specifications",
    },
  ] satisfies ISection[]
  
  useEffect(() => {
    dispatch(getMachineName())
  }, [dispatch])
  
  return (
    <HeaderLayout>
      <div className="w-full h-full lg:pt-16">
        <ScrollPageLayout sections={configSections}>
          <div ref={Ollama} className={"min-h-[20rem] dark:bg-white/5 rounded-2xl m-2 p-4"}>
            <CardH2>Ollama</CardH2>
            <div className="py-4">
              <OllamaForm/>
            </div>
          </div>
          
          <div ref={OpenAi} className={"min-h-[20rem] dark:bg-white/5 rounded-2xl m-2 p-4"}>
            <CardH2>Open AI</CardH2>
            <div className={"py-4"}>
              <OpenAiForm/>
            </div>
          </div>
          
          <div ref={BedRock} className={"min-h-[20rem] dark:bg-white/5 rounded-2xl m-2 p-4"}>
            <CardH2>AWS Bed Rock</CardH2>
            <div>todo</div>
          </div>
          
          <div ref={ApiSpecifications} className={""}>
            <CardH2>Api Specifications</CardH2>
          </div>
          {Object.keys(apis).length > 0 && <CardSection>
            <CardH3>Existing</CardH3>
              <div className={"flex flex-col"}>
                {
                  Object.keys(apis).map((key) => <div key={key}>{apis[key].name}</div>)
                }
              </div>
            </CardSection>
          }
          <CardSection>
            <CardH3>Use api specification info</CardH3>
            <ApiForm/>
          </CardSection>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
