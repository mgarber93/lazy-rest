import {Input} from '@headlessui/react'
import clsx from 'clsx'
import {ChangeEventHandler, FocusEventHandler} from 'react'

const elements = `border rounded bg-transparent border-neutral-700 dark:bg-neutral-950/5`

const inputClass = clsx(
  elements,
  'flex-grow py-1.5 px-3 text-sm/6 dark:text-white w-full',
  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
)

export type AppInputProps = {
  onBlur?: FocusEventHandler<HTMLInputElement>
  defaultValue?: string | number | readonly string[] | undefined
  placeholder?: Readonly<string>
  type: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  value: string | number | readonly string[] | undefined
}

export function AppInput({onBlur, type, placeholder, defaultValue, onChange, value}: AppInputProps) {
  return (
    <Input
      className={inputClass}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      type={type}
    />
  )
}
