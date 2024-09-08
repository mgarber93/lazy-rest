import React, {MutableRefObject, ReactNode, useEffect} from 'react'
import {Center} from './center'

export function ScrollPageLayout({sectionRefs, children}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement>>,
  children?: ReactNode,
}) {
  const scrollToSection = (section: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sectionRefs[section]?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }
  
  useEffect(() => {
    const hash = window.location.hash.substring(1) // get section from URL
    if (hash && sectionRefs[hash]) {
      scrollToSection(hash)
    }
  }, [])
  
  return <Center>
    <div className="col-span-1">
      <aside className="sticky top-4">
        <ul>
          {
            Object.keys(sectionRefs).map((sectionKey) => (
              <li key={sectionKey}>
                <a href={`#${sectionKey}`} onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(sectionKey)
                }}>
                  {sectionKey.replace("section", "Section ")}
                </a>
              </li>
            ))
          }
        </ul>
      </aside>
    </div>
    <div className="col-span-3 top-4">
      {children}
    </div>
    <div className="col-span-1"></div>
  </Center>
}
