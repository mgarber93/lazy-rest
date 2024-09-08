import {Field, Fieldset, Input, Label, Legend, Select, Textarea} from '@headlessui/react'

import clsx from 'clsx'

export function OpenAiForm() {
  return (
    <Fieldset className="w-full space-y-6">
      <Field>
        <Label className="text-sm/6 font-medium text-black dark:text-white">API Key <span
          className="text-red-500">*</span></Label>
        <Input
          required
          type="password"
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
      </Field>

      <Field>
        <Label className="text-sm/6 font-medium text-black dark:text-white">Base URL</Label>
        <Input
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
      </Field>
    </Fieldset>
  )
}
  