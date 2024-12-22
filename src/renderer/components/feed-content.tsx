import clsx from 'clsx'
import React, {useCallback, useState} from 'react'
import {motion} from 'framer-motion'
import {CardSection} from '../wrapper/card'
import {HttpCallForm} from './http-call-form'
import {ApiCallPlan, ProgressStage, SequenceActivity} from '../../models/api-call-plan'
import {headerTransparencyEffect} from '../utils/transparent'

export function HttpCallCard({activity, index, contentId}: {
  activity: SequenceActivity,
  index: number,
  apiCallPlan: ApiCallPlan,
  contentId: string
}) {
  const [isOpen, setIsOpen] = useState(activity.progressStage === ProgressStage.active)
  
  const handleToggle = useCallback(() => {
    setIsOpen(isOpen => !isOpen)
  }, [isOpen, setIsOpen])
  
  return <CardSection className={clsx(
    headerTransparencyEffect,
    "flex flex-col gap-1 dark:bg-neutral-900",
    "rounded-none"
  )}>
    <div className={"h-full py-0 px-0 border-b border-neutral-100 dark:border-neutral-600"}>
      <div className={"flex flex-row text-nowrap gap cursor-pointer dark:text-neutral-300"} onClick={handleToggle}>
        <span className={"w-full max-w-14 text-left font-mono text-4xl overflow-hidden align-center border-r border-neutral-100 dark:border-neutral-700"}>
          {(index ?? 0)}
        </span>
        <span className={"flex-grow text-wrap indent-6 pl-4 font-mono text-sm align-center select-none"}>
          {activity.step?.name}
        </span>
      </div>
    </div>
    <motion.div
      initial={{height: 0}}
      animate={{height: isOpen ? 'auto' : 0}}
      transition={{duration: 0.2}}
      style={{overflow: 'hidden'}}
    >
      <HttpCallForm step={activity.step} contentId={contentId} sequenceId={index}/>
    </motion.div>
  </CardSection>
}

export interface FeedContentProps {
  apiCallPlan: ApiCallPlan
  contentId: string
}

export function FeedContent({apiCallPlan, contentId}: FeedContentProps) {
  return (
    <div className={"flex flex-col gap-1.5"}>
      {apiCallPlan.steps?.map((activity, index) => (
        <HttpCallCard contentId={contentId} apiCallPlan={apiCallPlan} activity={activity} index={index}
                      key={activity.id}/>),
      )}
    </div>
  )
}
