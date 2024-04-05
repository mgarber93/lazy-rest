import {useCallback, useState} from 'react';
import {Card} from './card';
import {useCurrentConversation} from '../hooks/current-conversation';
import {ModelSelector} from './responder-type/model-selector';
import {TResponder} from '../../models/responder';
import {SelectResponderType} from './responder-type/select-responder-type';
import {AgentSelector} from './responder-type/agent-selector';
import {OrganizationSelector} from './responder-type/organization-selector';


function agentSelectorForm(type: TResponder) {
  switch (type) {
    case "chat": {
      return <ModelSelector/>;
    }
    case "agent": {
      return <AgentSelector/>;
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
  const conversation = useCurrentConversation();
  const initialState = conversation?.responder?.type ?? 'none';
  const [type, setType] = useState(initialState);
  const handleValueChange = useCallback((type: TResponder) => {
    setType(type);
  }, [setType]);
  
  return <Card>
    <>
      <SelectResponderType type={type as TResponder} setType={handleValueChange}/>
      {agentSelectorForm(type as TResponder)}
    </>
  </Card>
}