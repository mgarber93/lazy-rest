import {Button, ButtonGroup, Form} from 'react-bootstrap';
import {Card} from './card';
import {useCurrentConversation} from '../hooks/current-conversation';
import {useAppSelector} from '../features/store';
import {useState} from 'react';


export function ModelSelector() {
  const {models} = useAppSelector(state => state.models)

  return <ButtonGroup>
    {models.map(model => <Button size={"sm"} key={model} variant={"secondary"}>
      <span className={"sm-text"}>{model}</span>
    </Button>)}
  </ButtonGroup>
}

function SelectResponderType() {
  return (
    <Form.Select size="sm">
      <option value="none">none</option>
      <option value="chat">chat</option>
      <option value="agent">agent</option>
      <option value="organization">organization</option>
    </Form.Select>
  );
}


/**
 * I want this component to allow the user to select a responder
 * A responder a graph of agents, such that a node is an agent and an edge is the process
 * flow
 */
export function AgentSelector() {
  const [type, setType] = useState('')
  const conversation = useCurrentConversation();
  return <Card>
    <SelectResponderType />
    <ModelSelector />
  </Card>
}