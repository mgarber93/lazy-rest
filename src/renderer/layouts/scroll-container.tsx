import React, {MutableRefObject, ReactNode, useCallback} from 'react'
import {Center} from '../wrapper/center'
import clsx from 'clsx'
import {CardH3} from '../wrapper/card'


export function Sections({sectionRefs}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement | null>>,
}) {
  const scrollToSection = useCallback((section: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sectionRefs[section]?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }, [sectionRefs])
  const keys = Object.keys(sectionRefs)
  return keys.length > 0 ? <div className={"p-2 transition-all rounded-xl m-2"}>
    <CardH3>On this page</CardH3>
    <ul>
      {
        Object.keys(sectionRefs).map((sectionKey) => (
          <li key={sectionKey}>
            <a
              href={`#${sectionKey}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(sectionKey)
              }}
              className={"text-sm text-nowrap text-ellipsis"}
            >
              {sectionKey.replace(/([A-Z])/g, " $1".toLowerCase())}
            </a>
          </li>
        ))
      }
    </ul>
  </div> : <></>
}

export function ScrollPageLayout({sectionRefs, children}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement | null>>,
  children?: ReactNode,
}) {
  const effect = "border border-transparent border-black/5 h-full"
  const background = "bg-zinc-50/50 bg-zinc-50 dark:bg-zinc-900/[95%]"
  return <div className={clsx('h-[calc(100vh-55.313px)]')}>
    <Center>
      <div className={clsx("col-span-1 h-[calc(100vh-55.313px)]")}>
        <aside className={clsx(effect,
          "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
          background,
        )}>
          <Sections sectionRefs={sectionRefs}/>
        </aside>
      </div>
      <div className={clsx(
        "col-span-5 top-4 rounded-2xl",
        "h-[calc(100vh-55.313px)] mb-2 overflow-y-scroll",
        background,
      )}>
        {children}
      </div>
      <div className="col-span-1"></div>
    </Center>
  </div>
  
}
