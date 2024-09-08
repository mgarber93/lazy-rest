import {HeaderLayout} from '../layouts/header-layout'
import {ApiForm} from '../wrapper/api-form'
import React, {MutableRefObject, useRef} from 'react'
import {ScrollPageLayout} from '../wrapper/scroll-container'

export function SettingsPage() {
  const sectionRefs = {
    section1: useRef<HTMLDivElement>(null),
    section2: useRef<HTMLDivElement>(null),
    section3: useRef<HTMLDivElement>(null),
  } as Record<string, MutableRefObject<HTMLDivElement>>
  return (
    <HeaderLayout>
      <div className="w-full h-full2">
        <ScrollPageLayout sectionRefs={sectionRefs}>
          <ApiForm sectionRefs={sectionRefs}/>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}