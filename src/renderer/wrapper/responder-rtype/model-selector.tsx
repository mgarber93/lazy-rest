import {Form} from 'react-bootstrap';
import {useCallback} from 'react';
import styled from 'styled-components';
import {useAppDispatch, useAppSelector} from '../../features/store';
import {useCurrentConversation} from '../../hooks/current-conversation';
import {Card} from '../card';
import {setResponder} from '../../features/chat';
import {createModelResponder, getModel} from '../../../models/responder';

const Label = styled.label`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  padding: 0.3rem;
  user-select: none;
`

function ModelSelectRadio(props: { type: string, selected: string }) {
  const {type, selected} = props;
  
  const currentConversation = useCurrentConversation();
  const dispatch = useAppDispatch();
  const handleModelChange = useCallback(() => {
    dispatch(setResponder({
      responder: createModelResponder('chat', type, 'openai'),
      chatId: currentConversation.id,
    }))
  }, [dispatch, type, currentConversation]);
  const id = `${type}-radio-selector`;
  
  return <div className="mb-1">
    <Label htmlFor={id}>
      <input
        onClick={handleModelChange}
        type={"radio"}
        name="model-selection"
        id={id}
        value={type}
        checked={type === selected}
        readOnly
      />
      <span>{type}</span>
    </Label>
  </div>
}

export function ModelSelector() {
  const currentConversation = useCurrentConversation();
  const selectedType = getModel(currentConversation.responder);
  const {models} = useAppSelector(state => state.models);
  return <Card>
    <Form>
      {models.map((type) => <ModelSelectRadio key={type} selected={selectedType} type={type}/>)}
    </Form>
  </Card>;
}