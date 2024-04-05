import {Form} from 'react-bootstrap';

export interface SelectionOption {
  display: string;
  value: string;
}

export function Select(props: { value: any, handleValueChange: (value: any) => void, options: SelectionOption[] }) {
  const {options, handleValueChange, value} = props;
  return (
    <Form.Select value={value} onChange={handleValueChange} size="sm">
      {options.map(option => <option key={option.value} value={option.value}>{option.display}</option>)}
    </Form.Select>
  );
}