import React, {ReactNode, RefObject, useCallback, useState} from 'react'
import {Center} from '../wrapper/center'
import clsx from 'clsx'
import {CardH3} from '../wrapper/card'
import {UserInputForm} from '../pages/user-input-form'
import {PencilIcon} from '@heroicons/react/24/solid'

export interface ISection {
  id: string
  ref: RefObject<HTMLDivElement | null>
  label: string
}


export function Sections({sections}: {
  sections: ISection[],
}) {
  const scrollToSection = useCallback((section: RefObject<HTMLDivElement | null>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    section?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }, [])
  const [clicked, setClicked] = useState<boolean>(false)
  const handleMouseUp = useCallback(() => {
    setClicked(false)
  }, [setClicked])
  const handleMouseDown = useCallback(() => {
    setClicked(true)
  }, [setClicked])
  
  return sections.length > 0 ? <div className={"p-2 transition-all rounded-xl m-2"}>
    <div className={"flex flex-row border-b-2 border-black/5 pb-2"}>
      <CardH3 className={"w-full border-b-0"}>On this page
      </CardH3>
      <div
        className={clsx(
          "rounded-full",
          "size-7 p-1 ml-auto relative right-0 bg-gray-200 dark:bg-black/50 transition-colors",
          "px-1 hover:scale-125 transition-transform cursor-pointer",
          clicked && "hover:scale-90",
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <PencilIcon className={"w-full h-full dark:fill-zinc-200 hover:fill pointer-events-none"}/>
      </div>
    </div>
    <ul>
      {
        sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(s.ref)
              }}
              className={"text-sm text-nowrap text-ellipsis whitespace-pre"}
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
  const background = "bg-zinc-50/50 bg-zinc-50 dark:bg-zinc-900/[95%] shadow-xl"
  return <div className={clsx('h-[calc(100vh-55.313px)]')}>
    <Center>
      <div className={clsx("lg:col-span-1 col-span-2 h-[calc(100vh-55.313px)]")}>
        <aside className={clsx(effect,
          "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
          background,
        )}>
          <Sections sections={sections}/>
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

export function ScrollUserInputPageLayout({sections, children}: {
  sections: ISection[],
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
        <Sections sections={sections}/>
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
        "col-span-4 row-span-1 bg-transparent",
      )}>
        <UserInputForm/>
      </div>
    </Center>
  </div>
}
