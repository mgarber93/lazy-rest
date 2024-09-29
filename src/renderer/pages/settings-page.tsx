import React, {MutableRefObject, useEffect, useRef} from 'react'
import {HeaderLayout} from '../layouts/header-layout'
import {ApiForm} from '../wrapper/api-form'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {OpenAiForm} from '../wrapper/open-ai-form'
import {Card, CardH2, CardH3, CardSection} from '../wrapper/card'
import {getMachineName} from '../features/user'
import {useAppDispatch, useAppSelector} from '../features/store'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const apis = useAppSelector(state => state.tools.api)
  const sectionRefs = {
    Ollama: useRef<HTMLDivElement>(null),
    OpenAi: useRef<HTMLDivElement>(null),
    BedRock: useRef<HTMLDivElement>(null),
    ApiSpecifications: useRef<HTMLDivElement>(null),
  } as Record<string, MutableRefObject<HTMLDivElement>>
  const keys = Object.keys(sectionRefs)
  useEffect(() => {
    dispatch(getMachineName())
  }, [dispatch])
  
  return (
    <HeaderLayout>
      <div className="w-full h-full">
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <Card>
            <div ref={sectionRefs.Ollama} id={keys[1]} className={"min-h-[20rem]"}>
              <CardH2>Ollama</CardH2>
              <div className="py-4">
              
              </div>
            </div>
          </Card>
          <Card>
            <div ref={sectionRefs.OpenAi} id={keys[1]} className={"min-h-[20rem]"}>
              <CardH2>Open AI</CardH2>
              <div className={"py-4"}>
                <OpenAiForm/>
              </div>
            </div>
          </Card>
          
          <Card>
            <div ref={sectionRefs.BedRock} id={keys[2]} className={"min-h-[20rem]"}>
              <CardH2>AWS Bed Rock</CardH2>
              <div>todo</div>
            </div>
          </Card>
          
          <Card className={"pb-4"}>
            <div ref={sectionRefs.ApiSpecifications} id={keys[0]} className={""}>
              <CardH2>Api Specifications</CardH2>
            </div>
            <CardSection>
              {Object.keys(apis).length && <CardH3>Existing</CardH3>}
              <div className={"flex flex-col"}>
                {
                  Object.keys(apis).map((key) => <div key={key}>{apis[key].name}</div>)
                }
              </div>
            </CardSection>
            <CardSection>
              <CardH3>Add new</CardH3>
              <ApiForm/>
            </CardSection>
          </Card>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
