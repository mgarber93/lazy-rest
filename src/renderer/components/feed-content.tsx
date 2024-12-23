import React from 'react'
import {HttpCallForm} from './http-call-form'
import {ApiCallPlan} from '../../models/api-call-plan'

export interface FeedContentProps {
  apiCallPlan: ApiCallPlan,
  contentId: string,
  convoId: string
}

export function FeedContent({apiCallPlan, contentId, convoId}: FeedContentProps) {
  return (
    <div className={"flex flex-col gap-1.5"}>
      {apiCallPlan.steps?.map((activity, index) => (
        <HttpCallForm
          contentId={contentId}
          apiCallPlan={apiCallPlan}
          index={index}
          key={activity.id}
          convoId={convoId}
        />),
      )}
    </div>
  )
}
