import React, {ReactNode, RefObject, useCallback, useEffect, useRef, useState} from 'react'
import {Center} from '../wrapper/center'
import clsx from 'clsx'
import {CardH3} from '../wrapper/card'
import {UserInputForm} from '../pages/user-input-form'
import {AppIconButton} from './app-icon-button'
import {PencilIcon} from '@heroicons/react/24/solid'
import {useCurrentConversation} from '../hooks/current-conversation'
import {AnimatePresence, motion} from 'framer-motion'

export interface ISection {
  id: string
  ref: RefObject<HTMLDivElement | null>
  label: string
}

export function AppHorizontalChip({children, className}: { children: React.ReactNode, className?: string }) {
  return <div
    className={clsx(
      "flex flex-row border-b-2 border-black/5 pl-2 -mx-2 bg-black/5 dark:bg-black/25 px-2 pt-1 rounded-tl rounded-bl rounded-br-2xl rounded-tr-2xl",
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
    section?.current?.scrollIntoView({behavior: 'smooth', alignToTop: true})
  }, [])
  
  return sections.length > 0 ? <div className={"p-2 rounded m-2"}>
    <AppHorizontalChip>
      <CardH3 className={"w-full h-full border-b-0"}>On this page
      </CardH3>
      <AppIconButton>
        <PencilIcon className={"w-full h-full dark:fill-neutral-200 hover:fill pointer-events-none"}/>
      </AppIconButton>
    </AppHorizontalChip>
    <ul className={"flex flex-col gap-1"}>
      {
        sections?.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(s.ref)
              }}
              className={"text-sm text-nowrap text-ellipsis whitespace-pre"}
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
  const background = "bg-amber-50/5 dark:bg-neutral-900/[95%] shadow-xl"
  const convo = useCurrentConversation()
  return <div className={clsx('h-[calc(100vh-55.313px)]')}>
    <Center>
      <div className={clsx("lg:col-span-1 col-span-2 h-[calc(100vh-55.313px)]")}>
        <AnimatePresence>{
          !!convo.content.length && <aside className={clsx(effect,
            "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
            background,
          )}>
            <Sections sections={sections}/>
          </aside>
        }</AnimatePresence>
      
      </div>
      <div className={clsx(
        "col-span-4 top-4 rounded",
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
  const background = "bg-neutral-50/50 bg-neutral-50 dark:bg-neutral-900/[95%] shadow-xl"
  const convo = useCurrentConversation()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isScrollable, setIsScrollable] = useState(false)
  
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const isScrollable = contentRef.current.scrollHeight > contentRef.current.clientHeight
        setIsScrollable(isScrollable)
      }
    }
    // Check scrollable state initially
    checkScrollable()
    
    // Add resize listener to recheck scrollable state on resize
    window.addEventListener('resize', checkScrollable)
    
    return () => {
      window.removeEventListener('resize', checkScrollable)
    }
  }, [convo])
  
  return <div className={clsx('h-[calc(100vh-55.313px)]')}>
    <Center className={"lg:col-span-1 "}>
      <AnimatePresence>{
        convo.content.length > 3 ? <motion.aside
          initial={{opacity: 0, height: 'auto'}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.3}}
          className={clsx(effect,
            "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
            background,
            "row-span-2 col-span-2 lg:col-span-1",
          )}
        >
          <Sections sections={sections}/>
        </motion.aside> : <motion.div
          initial={{opacity: 1, height: 'auto'}}
          animate={{opacity: 0, height: 'auto'}}
          exit={{opacity: 0, height: '0'}}
          transition={{duration: 0.1}}
          className={"row-span-2 col-span-2 lg:col-span-1"}
        >
          <Sections sections={sections}/>
        </motion.div>
      }</AnimatePresence>
      <AnimatePresence>{
        convo.content.length ? <motion.div
          initial={{opacity: 0, height: 'auto'}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.2}}
          className={clsx(
            "col-span-4 top-4 rounded",
            "h-[calc(100vh-55.313px)] mb-2 overflow-y-scroll",
            background,
            effect,
            "row-span-1 col-span-4",
            "py-0 px-1 transition-all",
            isScrollable && '-mt-1.5 rounded-t-none',
          )}
          ref={contentRef}
        >
          {children}
        </motion.div> : <div className={"col-span-4"}></div>
      }</AnimatePresence>
      <div className={clsx(
        "col-span-4 row-span-1 bg-transparent",
      )}>
        <UserInputForm disabled={convo?.content?.at(-1)?.apiCallPlan ?? false}/>
      </div>
    </Center>
  </div>
}
