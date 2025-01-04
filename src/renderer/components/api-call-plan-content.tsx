import React from 'react'
import {HttpCallForm} from './http-call-form'
import {ApiCallPlan} from '../../models/api-call-plan'

export interface FeedContentProps {
  apiCallPlan: ApiCallPlan,
  contentId: string,
  chatId: string
}

/**
 * Show a list of planned calls for execution, review or editing
 * @param apiCallPlan
 * @param contentId
 * @param chatId
 * @constructor
 */
export function ApiCallPlanContent({apiCallPlan, contentId, chatId}: FeedContentProps) {
  // @todo control expanded form here
  return (
    <div className={"flex flex-col gap-1.5"}>
      {apiCallPlan.steps?.map((activity, index) => (
        <HttpCallForm
          contentId={contentId}
          apiCallPlan={apiCallPlan}
          index={index}
          key={activity.id}
          chatId={chatId}
        />),
      )}
    </div>
  )
}
