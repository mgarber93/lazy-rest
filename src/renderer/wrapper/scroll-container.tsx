import React, {MutableRefObject, ReactNode, useEffect} from 'react'
import {Center} from './center'
import clsx from 'clsx'

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
  const cardEffect = "rounded-xl p-4 bg-zinc-50"
  return <Center>
    <div className={clsx("col-span-1")}>
      <aside className={clsx("sticky top-4", cardEffect)}>
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
    <div className={clsx("col-span-3 top-4", cardEffect)}>
      {children}
    </div>
    <div className="col-span-1"></div>
  </Center>
}
