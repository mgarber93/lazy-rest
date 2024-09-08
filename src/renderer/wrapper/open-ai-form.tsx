import {Description, Field, Fieldset, Input, Label} from '@headlessui/react'
import clsx from 'clsx'
import {useAppDispatch, useAppSelector} from '../features/store'
import {ChangeEvent, useCallback} from 'react'
import {configureOpenAi} from '../features/models'

export function OpenAiForm() {
  const providers = useAppSelector(state => state.models.providers)
  const dispatch = useAppDispatch()
  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    dispatch(configureOpenAi({apiKey: value}))
  }, [dispatch])
  return (
    <Fieldset className="w-full space-y-6">
      <Field>
        <Label className="text-sm/6 font-medium text-black dark:text-white">API Key <span
          className="text-red-500">*</span></Label>
        <Description>
          See <span className={"bg-black/5 dark:bg-white/5 px-2 py-1 rounded"}>https://platform.openai.com/api-keys</span> for more information
        </Description>
        <Input
          required
          type="password"
          value={providers.openAi?.apiKey}
          onChange={handleValueChange}
          className={clsx(
            'mt-3 block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          )}
        />
      </Field>

      <Field>
        <Label className="text-sm/6 font-medium text-black dark:text-white">Base URL (todo)</Label>
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
  