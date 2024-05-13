import styled from 'styled-components'

export interface SelectionOption {
  display: string;
  value: string;
}

const SelectWrapper = styled.select`
`

export function Select(props: { value: any, handleValueChange: (value: any) => void, options: SelectionOption[] }) {
  const {options, handleValueChange, value} = props
  return (
    <SelectWrapper value={value} onChange={handleValueChange}>
      {options.map(option => <option key={option.value} value={option.value}>{option.display}</option>)}
    </SelectWrapper>
  )
}