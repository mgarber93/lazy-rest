import {PlanStep} from '../../main/organizations/api-call-plan'

export function PlannedHttpRequest({step}: { step: PlanStep }) {
  const plan = step.action
  if (!plan) {
    return <div className={"d-flex flex-row gap-2"}>
      Something went wrong
    </div>
  }
  
  return <div className={"d-flex flex-row gap-2" + ` ${plan.method}`}>
    <span className={"method"}>
      {plan.method}
    </span>
    <span className={"path"}>
      {plan.path}
    </span>
    <span className={"background"}>
      {step.background}
    </span>
  </div>
}

