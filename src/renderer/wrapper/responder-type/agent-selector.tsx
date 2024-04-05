import {Select} from '../../components/select';
import {ModelSelector} from './model-selector';
import {useCallback} from 'react';

export function AgentSelector() {
  const callback = useCallback(() => {
  }, [])
  return <>
    <Select
      value={'api-value'}
      handleValueChange={callback}
      options={[{display: 'api-planner', value: 'api-planner'}, {display: 'api-value', value: 'api-value'}]}
    />
    <ModelSelector/>
  </>;
}