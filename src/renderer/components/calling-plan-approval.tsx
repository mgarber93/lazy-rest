import styled from 'styled-components'
import {EndpointCallPlan} from '../../models/endpoint'
import {Icon} from './icon'
import {FormGroup} from '../wrapper/form-group'

const Wrapper = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
`

const plan = [
  {method: "GET", path: "/search", background: "to search for Pink Floyd and get their id"},
  {method: "GET", path: "/artists/<id>/top-tracks", background: "with country code parameter set to major markets"},
  {method: "GET", path: "/tracks/<id>", background: "to get the play count of \"Wish you were here\""},
  {method: "PUT", path: "/search", background: "to search for Pink Floyd and get their id"},
  {method: "POST", path: "/artists/<id>/top-tracks", background: "with country code parameter set to major markets"},
  {method: "DELETE", path: "/tracks/<id>", background: "to get the play count of \"Wish you were here\""},
]

const Div = styled.div`
  & * {
    
    display: flex;
    flex-direction: column;
  }
  text-align: left;
  border-radius: var(--border-radius);
  padding: 1rem 1rem;
  border: 1px solid var(--background-color-9);
  

  &.GET {
  }

  &.PUT {
  }

  &.POST {
  }

  &.DELETE {
  }
  .method {
    min-width: 4rem;
    color:  var(--accent);
  }

  .path {
    min-width: 11rem;
  }
  .background {
    min-width: 20rem;
  }
  .controls {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    & svg {
      background-color: var(--background-color-6);
    }
  }
`

export function Plan({plan}: { plan: EndpointCallPlan }) {
  return <Div className={"d-flex flex-row gap-2" + ` ${plan.method}`}>
    <span className={"method" }>
      {plan.method}
    </span>
    <span className={"path"}>
    {plan.path}
    </span>
    <span className={"background"}>
    {plan.background}
    </span>
    <span className={"controls"}>
      <Icon type={"checkbox"}/>
      <Icon type={"erasure"}/>
    </span>
  </Div>

}

export function CallingPlanApproval(props: any) {
  return <FormGroup name={'Calling Plan Approval Needed'}>
    <Wrapper>
      {plan.map((item: any, index: number) => <Plan plan={item} key={item.background}></Plan>)}
    </Wrapper>
  </FormGroup>
}
