import {useCallback} from 'react'
import {TResponder} from '../../../models/responder'
import styled from 'styled-components'

const Select = styled.select`
`

export function SelectResponderType(props: { type: TResponder, setType: (str: TResponder) => void }) {
  const {type, setType} = props
  const handleValueChange = useCallback((event: any) => {
    setType(event.target.value)
  }, [setType])
  
  return (
    <Select value={type} onChange={handleValueChange}>
      <option value="chat">chat</option>
      <option value="agent">agent</option>
      <option value="organization">organization</option>
    </Select>
  )
}