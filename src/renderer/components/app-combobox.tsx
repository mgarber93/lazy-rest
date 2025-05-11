import {Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions} from '@headlessui/react'
import {CheckIcon, ChevronDownIcon} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import {useState} from 'react'

export interface ComboSelectable {
  id: number
  name: string
}

export interface PropsAppComboBox {
  options: ComboSelectable[]
  onChange?: (selected: ComboSelectable) => void
  initialSelected?: ComboSelectable
}

export function AppCombobox({options, onChange, initialSelected}: PropsAppComboBox) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(initialSelected || options[0] || { id: 0, name: '' })

  const filteredOptions =
    query === ''
      ? options
      : options.filter((o) => {
        return o.name.toLowerCase().includes(query.toLowerCase())
      })

  const handleChange = (value: ComboSelectable) => {
    setSelected(value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Combobox value={selected} onChange={handleChange}
      onClose={() => setQuery('')}
    >
      <div className="relative">
        <ComboboxInput
          className={clsx(
            'w-full rounded border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
          displayValue={(selectable: ComboSelectable) => selectable?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white"/>
        </ComboboxButton>
      </div>
      
      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          'w-[var(--input-width)] max-h-[400px] overflow-y-auto rounded border border-white/5 bg-neutral-950 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 ',
        )}
      >
        {filteredOptions.map((selectable) => (
          <ComboboxOption
            key={selectable.id}
            value={selectable}
            className="group flex cursor-default items-center gap-2 rounded py-1.5 px-3 select-none data-[focus]:bg-white/10"
          >
            <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible"/>
            <div className="text-sm/6 text-white">{selectable.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
