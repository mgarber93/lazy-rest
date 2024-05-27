import {useCallback, useState} from 'react'
import styled from 'styled-components'

import {useCurrentConversation} from '../hooks/current-conversation'
import {ModelSelector} from './responder-type/model-selector'
import {TResponder} from '../../models/responder'
import {SelectResponderType} from './responder-type/select-responder-type'
import {AgentSelector} from './responder-type/agent-selector'
import {OrganizationSelector} from './responder-type/organization-selector'
import {Button} from '../styled/button'


const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1rem;
  width: var(--aside-nav);

  button {
    display: block;
    text-align: center;
    color: buttonface;
    font-size: larger;
    padding: 0;
    font-family: "Maple Mono", Tahoma, serif;
    border-radius: var(--border-radius);
  }
`

const EditButton = styled(Button)`
  background: none;
  height: 2.55rem;
  border-radius: var(--border-radius);
  font-family: "Maple Mono", Tahoma, serif;
  color: var(--grey);
  border: none;
`

function agentSelectorForm(type: TResponder) {
  switch (type) {
    case "chat": {
      return <ModelSelector/>
    }
    case "agent": {
      return <AgentSelector/>
    }
    case "organization": {
      return <OrganizationSelector/>
    }
    default: {
      return null
    }
  }
}

export function ResponderType() {
  const [editing, setEditing] = useState(false)
  const conversation = useCurrentConversation()
  const initialState = conversation?.responder?.type ?? 'chat'
  const [type, setType] = useState(initialState)
  
  const handleValueChange = useCallback((type: TResponder) => {
    setType(type)
  }, [setType])
  const handleEditClick = useCallback(() => {
    setEditing(true)
  }, [setEditing])
  return <Div>{
    editing ? (
      <>
        {agentSelectorForm(type as TResponder)}
        <SelectResponderType type={type as TResponder} setType={handleValueChange}/>
      </>
    ) : (
      <EditButton onClick={handleEditClick}>Change Responder</EditButton>
    )
  }
  </Div>
}
