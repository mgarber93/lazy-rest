import React, { ReactNode } from "react"
import { Description, Field, Input, Label } from "@headlessui/react"
import clsx from "clsx"

export const labelClasses = "text-sm/6 font-medium text-black dark:text-white"
export const descriptionClasses = "text-sm"
export const inputClasses = clsx(
  "mt-3 block w-full rounded border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white",
  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
)

export function ApiFormElement({
                                 domName,
                                 label,
                                 changeHandler,
                                 placeholder,
                                 type,
                                 value,
                                 description
                               }: {
  domName: string
  label: ReactNode
  changeHandler: (...args: never[]) => void
  placeholder: string
  type: string
  value: string
  description?: string
}) {
  return (
    <Field>
      <Label className={labelClasses}>
        <label htmlFor={domName}>{label}</label>
      </Label>
      <Description>{description}</Description>
      <Input
        className={inputClasses}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        value={value}
      ></Input>
    </Field>
  )
}
