import React, {MutableRefObject, ReactNode, useCallback} from 'react'
import {Center} from '../wrapper/center'
import clsx from 'clsx'
import {CardH3} from '../wrapper/card'
import {UserInputForm} from '../pages/user-input-form'


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
  const background = "bg-zinc-50/50 bg-zinc-50 dark:bg-zinc-900/[95%] shadow-xl"
  return <div className={clsx('h-[calc(100vh-55.313px)]')}>
    <Center>
      <div className={clsx("lg:col-span-1 col-span-2 h-[calc(100vh-55.313px)]")}>
        <aside className={clsx(effect,
          "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
          background,
        )}>
          <Sections sectionRefs={sectionRefs}/>
        </aside>
      </div>
      <div className={clsx(
        "col-span-4 top-4 rounded-2xl",
        "h-[calc(100vh-55.313px)] mb-2 overflow-y-scroll",
        background,
        effect,
      )}>
        <div className={"p-4"}>
          {children}
        </div>
      </div>
      <div className="col-span-1 lg:col-span-0">
      </div>
    </Center>
  </div>
}

export function ScrollUserInputPageLayout({sectionRefs, children}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement | null>>,
  children?: ReactNode,
}) {
  const effect = "border border-transparent border-black/5 h-full"
  const background = "bg-zinc-50/50 bg-zinc-50 dark:bg-zinc-900/[95%] shadow-xl"
  return <div className={clsx('h-[calc(100vh-55.313px)]')}>
    <Center className={"lg:col-span-1 "}>
      <aside className={clsx(effect,
        "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
        background,
        "row-span-2 col-span-2 lg:col-span-1",
      )}>
        <Sections sectionRefs={sectionRefs}/>
      </aside>
      <div className={clsx(
        "col-span-4 top-4 rounded-2xl",
        "h-[calc(100vh-55.313px)] mb-2 overflow-y-scroll",
        background,
        effect,
        "row-span-1 col-span-4",
        "p-4",
      )}>
        {children}
      </div>
      <div className={clsx(
        "col-span-4 row-span-1",
      )} ref={sectionRefs['New Prompt']}>
        <UserInputForm/>
      </div>
    </Center>
  </div>
}
