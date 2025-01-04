import React, {ReactNode, useEffect, useRef, useState} from 'react'
import {useCurrentConversation} from '../hooks/current-conversation'
import clsx from 'clsx'
import {Center} from '../wrapper/center'
import {AnimatePresence, motion} from 'framer-motion'
import {UserInputForm} from '../pages/user-input-form'
import {ISection, Sections} from './scroll-page-layout'

export function ScrollUserInputPageLayout({sections, children}: {
  sections: ISection[],
  children?: ReactNode,
}) {
  const effect = "border border-transparent border-black/5 h-full"
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
  const disabled = (() => {
    const lastStep = convo?.content?.at(-1)?.apiCallPlan?.steps?.at(-1)
    return lastStep?.step.response?.interpretation ? false : convo?.content?.at(-1)?.apiCallPlan ?? false
  })()
  
  return <div className={clsx('h-[calc(100vh-47px)]')}>
    <Center className={""}>
      <AnimatePresence>{
        convo.content.length > 3 ? <motion.aside
          initial={{opacity: 0, height: 'auto'}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.03}}
          className={clsx(effect,
            "rounded-l rounded-bl rounded-br-3xl rounded-tr-3xl",
            "row-span-2 col-span-1 lg:col-span-1",
          )}
        >
          <Sections sections={sections}/>
        </motion.aside> : <motion.div
          initial={{opacity: 1, height: 'auto'}}
          animate={{opacity: 0, height: 'auto'}}
          exit={{opacity: 0, height: '0'}}
          transition={{duration: 0.1}}
          className={"row-span-2 col-span-1 lg:col-span-1"}
        >
          <Sections sections={sections}/>
        </motion.div>
      }</AnimatePresence>
      <AnimatePresence>{
        <motion.div
          initial={{opacity: 0.8, height: 'auto'}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
          transition={{duration: 0.3}}
          className={clsx(
            "col-span-4 top-4 rounded",
            "h-[calc(100vh-47px)] mb-2",
            effect,
            "row-span-1 col-span-4 lg:col-span-4",
            "p-0 bg-transparent",
            isScrollable && '-mt-1.5 rounded-t-none',
          )}
          ref={contentRef}
        >
          {children}
        </motion.div>
      }</AnimatePresence>
      <div className={clsx(
        "col-span-4 lg:col-span-4 row-span-1 bg-transparent",
      )}>
        <UserInputForm disabled={disabled}/>
      </div>
    </Center>
  </div>
}