import React, {MutableRefObject, ReactNode, useCallback, useEffect} from 'react'
import {Center} from '../wrapper/center'
import clsx from 'clsx'
import {Card} from '../wrapper/card'


export function Sections({sectionRefs}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement | null>>,
}) {
  const scrollToSection = useCallback((section: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sectionRefs[section]?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }, [sectionRefs])
  const keys = Object.keys(sectionRefs)
  return keys.length > 0 ? <Card>
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
  </Card> : <></>
}

export function ScrollPageLayout({sectionRefs, children}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement | null>>,
  children?: ReactNode,
}) {
  const scrollToSection = useCallback((section: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sectionRefs[section]?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }, [sectionRefs])
  useEffect(() => {
    const hash = window.location.hash.substring(1) // get section from URL
    if (hash && sectionRefs[hash]) {
      scrollToSection(hash)
    }
  }, [])
  return <Center>
    <div className={clsx("col-span-1")}>
      <aside className={clsx("sticky top-0")}>
        <Sections sectionRefs={sectionRefs} />
      </aside>
    </div>
    <div className={clsx("col-span-3 top-4")}>
      {children}
    </div>
    <div className="col-span-1"></div>
  </Center>
}
