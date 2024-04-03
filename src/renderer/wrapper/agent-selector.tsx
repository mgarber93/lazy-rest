import {useCallback, useState} from 'react';
import {Card} from './card';
import {useCurrentConversation} from '../hooks/current-conversation';
import {useAppDispatch} from '../features/store';
import {ModelSelector} from './agent-selector/model-selector';
import {TResponder} from '../../models/responder';
import {SelectResponderType} from './agent-selector/select-responder-type';


function agentSelectorForm(type: TResponder) {
  switch (type) {
    case "chat": {
      return <ModelSelector/>;
    }
    default: {
      return null;
    }
  }
}

export function AgentSelector() {
  const conversation = useCurrentConversation();
  const initialState = conversation?.responder?.type ?? 'none';
  const [type, setType] = useState(initialState);
  const dispatch = useAppDispatch();
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