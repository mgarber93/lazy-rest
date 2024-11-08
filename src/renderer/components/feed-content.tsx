import clsx from "clsx"
import React, { useCallback, useState } from "react"
import { ChevronUpIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { CardSection } from "../wrapper/card"
import { HttpCallForm } from "./http-call-form"
import { ApiCallPlan, mockSequence, ProgressStage, SequenceActivity } from "../../models/api-call-plan"

// @todo remove when implemented
function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
  return arr1
    .map((val, index) => val ?? arr2[index])
    .concat(arr2.slice(arr1.length))
}

export function HttpCallCard({
  activity,
  index,
  contentId,
}: {
  activity: SequenceActivity
  index: number
  apiCallPlan: ApiCallPlan
  contentId: string
}) {
  const [isOpen, setIsOpen] = useState(
    activity.progressStage === ProgressStage.active,
  )

  const handleToggle = useCallback(() => {
    setIsOpen((isOpen) => !isOpen)
  }, [setIsOpen])

  return (
    <CardSection className={clsx("flex flex-col gap-1")}>
      <div className={"h-full rounded p-2 px-0"}>
        <div className={"flex flex-row gap-2"}>
          {(index ?? 0) + 1}) {activity.step.name}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? -180 : 0 }}
            transition={{ duration: 0.2 }}
            className={clsx("ml-auto")}
          >
            <ChevronUpIcon
              className={clsx("h-7 w-7 cursor-pointer ml-auto")}
              onClick={handleToggle}
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: "hidden" }}
      >
        <HttpCallForm
          step={activity.step}
          contentId={contentId}
          sequenceId={index}
        />
      </motion.div>
    </CardSection>
  )
}

export interface FeedContentProps {
  apiCallPlan: ApiCallPlan
  contentId: string
}

export function FeedContent({ apiCallPlan, contentId }: FeedContentProps) {
  return (
    <div className={"flex flex-col gap-1.5"}>
      {mergeArrays(apiCallPlan.steps, mockSequence).map((activity, index) => (
        <HttpCallCard
          contentId={contentId}
          apiCallPlan={apiCallPlan}
          activity={activity}
          index={index}
          key={activity.id}
        />
      ))}
    </div>
  )
}
