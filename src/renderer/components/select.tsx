
export interface SelectionOption {
  display: string;
  value: string;
}


export function Select(props: { value: any, handleValueChange: (value: any) => void, options: SelectionOption[] }) {
  const {options, handleValueChange, value} = props
  return (
    <div onChange={handleValueChange}>
      {options.map(option => <option key={option.value} value={option.value}>{option.display}</option>)}
    </div>
  )
}
