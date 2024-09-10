import React, {MutableRefObject, useEffect, useRef} from 'react'
import {HeaderLayout} from '../layouts/header-layout'
import {ApiForm} from '../wrapper/api-form'
import {ScrollPageLayout} from '../layouts/scroll-container'
import {OpenAiForm} from '../wrapper/open-ai-form'
import {Card} from '../wrapper/card'
import {getMachineName} from '../features/user'
import {useAppDispatch, useAppSelector} from '../features/store'

export function SettingsPage() {
  const dispatch = useAppDispatch()
  const apis = useAppSelector(state => state.tools.api)
  const sectionRefs = {
    ApiSpecifications: useRef<HTMLDivElement>(null),
    OpenAi: useRef<HTMLDivElement>(null),
    BedRock: useRef<HTMLDivElement>(null),
  } as Record<string, MutableRefObject<HTMLDivElement>>
  const keys = Object.keys(sectionRefs)
  const headerClasses = `font-semibold text-2xl border-b border-black/50 dark:border-white/50 leading-relaxed`
  useEffect(() => {
    dispatch(getMachineName())
  }, [dispatch])
  
  return (
    <HeaderLayout>
      <div className="w-full h-full">
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <Card>
            <div ref={sectionRefs.ApiSpecifications} id={keys[0]} className={""}>
              <h2 className={headerClasses}>Api Specifications</h2>
            </div>
            
            <div className={"flex flex-col gap-4 py-4"}>
              {
                Object.keys(apis).map((key) => <div key={key}>{apis[key].name}</div>)
              }
              <ApiForm/>
            </div>
          </Card>
          
          <Card>
            <div ref={sectionRefs.OpenAi} id={keys[1]} className={"min-h-[20rem]"}>
              <h2 className={headerClasses}>Open AI Configuration</h2>
              <div className={"py-4"}>
                <OpenAiForm/>
              </div>
            </div>
          </Card>
          
          <Card>
            <div ref={sectionRefs.BedRock} id={keys[2]} className={"min-h-[20rem]"}>
              <h2 className={headerClasses}>AWS Bed Rock</h2>
              <div>todo</div>
            </div>
          </Card>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}
