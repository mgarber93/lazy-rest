import {useCallback} from 'react';
import {Form} from 'react-bootstrap';
import {TResponder} from '../../../models/responder';

export function SelectResponderType(props: { type: TResponder, setType: (str: TResponder) => void }) {
  const {type, setType} = props;
  const handleValueChange = useCallback((event: any) => {
    setType(event.target.value)
  }, [setType])
  
  return (
    <Form.Select value={type} onChange={handleValueChange} size="sm">
      <option value="none">none</option>
      <option value="chat">chat</option>
    </Form.Select>
  );
}