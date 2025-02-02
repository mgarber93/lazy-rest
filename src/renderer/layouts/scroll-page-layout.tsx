import React, {ReactNode, RefObject, useCallback} from 'react'
import clsx from 'clsx'
import {Center} from '../wrapper/center'
import {CardH3} from '../wrapper/card'

export interface ISection {
  id: string
  ref: RefObject<HTMLDivElement | null>
  label: string
}

export function AppHorizontalChip({children, className}: { children: React.ReactNode, className?: string }) {
  return <div
    className={clsx(
      "flex flex-row border-b-2 border-black/5 pl-2 -mx-2 bg-black/5 dark:bg-white/15 px-2 pt-1 rounded-tl rounded-bl rounded-br-2xl rounded-tr-2xl",
      "select-none",
      className,
    )}>
    {children}
  </div>
}

export function Sections({sections}: {
  sections: ISection[],
}) {
  const scrollToSection = useCallback((section: RefObject<HTMLDivElement | null>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    section?.current?.scrollIntoView({behavior: 'instant', alignToTop: true})
  }, [])
  
  return sections.length > 0 ? <div className={"rounded pl-4 mr-2 rounded-tl-none rounded-bl-none"}>
    <CardH3 className={"w-full h-full border-b-0 underline select-none"}>On this page
    </CardH3>
    <ul className={"flex flex-col gap-1 pl-4"}>
      {
        sections?.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(s.ref)
              }}
              className={"text-xs text-nowrap text-ellipsis overflow-hidden whitespace-pre select-none"}
              tabIndex={-1}
            >
              {s.label}
            </a>
          </li>
        ))
      }
    </ul>
  </div> : <></>
}

export function ScrollPageLayout({sections, children}: {
  sections: ISection[],
  children?: ReactNode,
}) {
  const effect = "border border-transparent border-black/5 h-full"
  return <div className={clsx('h-[calc(100vh-46.993px)]')}>
    <Center>
      <div className={clsx("lg:col-span-1 col-span-1 h-[calc(100vh-47px)]")}>
        <aside className={clsx(effect,
          "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl lg:pt-16 top-36 h-fit absolute",
        )}>
          <Sections sections={sections}/>
        </aside>
      </div>
      <div className={clsx(
        "col-span-4 top-4 rounded",
        "h-[calc(100vh-47px)] mb-2",
        effect,
      )}>
        <div className={""}>
          {children}
        </div>
      </div>
      <div className="col-span-0 lg:col-span-0">
      </div>
    </Center>
  </div>
}

