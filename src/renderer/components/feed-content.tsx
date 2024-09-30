import clsx from 'clsx'
import React, {useCallback, useState} from 'react'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/outline'
import {CardSection} from '../wrapper/card'
import {HttpCallForm} from './http-call-form'
import {mockSequence, ProgressStage, SequenceActivity} from '../../models/api-call-plan'


import {motion} from 'framer-motion'

export function HttpCallCard({activity, index}: { activity: SequenceActivity, index?: number }) {
  const [isOpen, setIsOpen] = useState(activity.progressStage === ProgressStage.active)
  const handleToggle = useCallback(() => {
    setIsOpen(isOpen => !isOpen)
  }, [isOpen, setIsOpen])
  
  return <CardSection className={"flex flex-col gap-1"}>
    <div className={"h-full rounded-xl p-2"}>
      <div className={"flex flex-row gap-2"}>
        {(index ?? 0) + 1}) {activity.step.name}
        {isOpen && <ChevronUpIcon className={clsx("h-7 w-7 cursor-pointer ml-auto")} onClick={handleToggle}/>}
        {!isOpen && <ChevronDownIcon className={clsx("h-7 w-7 cursor-pointer ml-auto")} onClick={handleToggle}/>}
      </div>
    </div>
    <motion.div
      initial={{height: 0}}
      animate={{height: isOpen ? 'auto' : 0}}
      transition={{duration: 0.2}}
      style={{overflow: 'hidden'}}
    >
      <HttpCallForm step={activity.step} contentId={activity.id} sequenceId={activity.id}/>
    </motion.div>
  </CardSection>
}

export function FeedContent() {
  return (
    <div className={"flex flex-col gap-2"}>
      {mockSequence.map((activity, index) => (
        <HttpCallCard activity={activity} index={index} key={activity.id}/>),
      )}
    </div>
  )
}
