import {HeaderLayout} from '../layouts/header-layout'
import {ApiForm} from '../wrapper/api-form'
import React, {MutableRefObject, useRef} from 'react'
import {ScrollPageLayout} from '../wrapper/scroll-container'
import {OpenAiForm} from '../wrapper/open-ai-form'

export function SettingsPage() {
  const sectionRefs = {
    ApiSpecifications: useRef<HTMLDivElement>(null),
    OpenAi: useRef<HTMLDivElement>(null),
    BedRock: useRef<HTMLDivElement>(null),
  } as Record<string, MutableRefObject<HTMLDivElement>>
  const keys = Object.keys(sectionRefs)
  return (
    <HeaderLayout>
      <div className="w-full h-full">
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <div ref={sectionRefs.ApiSpecifications} id={keys[0]} className={"min-h-[20rem]"}>
            <h2>Api Specifications</h2>
            <div className={"p-4"}>
              <ApiForm/>
            </div>
          </div>
          <div ref={sectionRefs.OpenAi} id={keys[1]} className={"min-h-[20rem]"}>
            <h2>Open AI</h2>
            <div className={"p-4"}>
              <OpenAiForm/>
            </div>
          </div>
          <div ref={sectionRefs.BedRock} id={keys[2]} className={"min-h-[20rem]"}>
            <h2>AWS Bed Rock</h2>
          </div>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}