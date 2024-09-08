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
          <div ref={sectionRefs.section1} id="section1">
            <h2>Section 1</h2>
            {/* Section 1 form fields */}
          </div>
          <div ref={sectionRefs.section2} id="section2">
            <h2>Section 2</h2>
            {/* Section 2 form fields */}
          </div>
          <div ref={sectionRefs.section3} id="section3">
            <ApiForm/>
          </div>
        </ScrollPageLayout>
      </div>
    </HeaderLayout>
  )
}