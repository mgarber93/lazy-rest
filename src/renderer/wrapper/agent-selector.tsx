import {Button, ButtonGroup, Form} from 'react-bootstrap';
import {useCallback, useState} from 'react';
import {Card} from './card';
import {useCurrentConversation} from '../hooks/current-conversation';
import {useAppDispatch, useAppSelector} from '../features/store';
import {Agent, AgentOrg, Conversation, isModelResponder} from '../../models/conversation';

type TConversation = "none" | "chat" | "agent" | "organization";

export function ModelSelector() {
  const {models} = useAppSelector(state => state.models)

  return <ButtonGroup>
    {models.map(model => <Button size={"sm"} key={model} variant={"secondary"}>
      <span className={"sm-text"}>{model}</span>
    </Button>)}
  </ButtonGroup>
}

function SelectResponderType(props: {setType: (str: TConversation) => void}) {
  const {setType} = props;
  const handleValueChange = useCallback((event: any) => {
    setType(event.target.value)
  }, [setType])

  return (
    <Form.Select onChange={handleValueChange} size="sm">
      <option value="none">none</option>
      <option value="chat">chat</option>
      <option value="agent">agent</option>
      <option value="organization">organization</option>
    </Form.Select>
  );
}

function getResponderType(conversation: Conversation): TConversation {
  if (conversation.responder === null) {
    return "none";
  }
  if ((conversation.responder as AgentOrg).agents) {
    return 'organization';
  }
  if (isModelResponder(conversation.responder)) {
    if ((conversation.responder as Agent).instructions) {
      return 'agent';
    }
    return 'chat';
  }
  return 'none';
}

function agentSelectorForm(type: "none" | "chat" |  "agent" | "organization") {
  switch (type) {
    case "none": {
      return null;
    }
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
  const [type, setType] = useState(getResponderType(conversation));
  const dispatch = useAppDispatch();
  const handleValueChange = useCallback((type: TConversation) => {
    setType(type);
  }, [setType]);

  return <Card>
    <>
      <SelectResponderType  setType={handleValueChange}/>
      {agentSelectorForm(type)}
    </>
  </Card>
}