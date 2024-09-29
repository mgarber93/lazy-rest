import clsx from 'clsx'
import {ChangeEvent, useCallback} from 'react'
import {Description, Field, Fieldset, Input, Label} from '@headlessui/react'
import {ArrowPathIcon} from '@heroicons/react/24/outline'

import {useAppDispatch, useAppSelector} from '../features/store'
import {configureOpenAi, listOpenAiModels} from '../features/models'
import {descriptionClasses, inputClasses, labelClasses} from '../components/api-form-element'

export function OpenAiForm() {
  const providers = useAppSelector(state => state.models.providers)
  const models = useAppSelector(state => state.models.models)
  const dispatch = useAppDispatch()
  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    dispatch(configureOpenAi({apiKey: value}))
  }, [dispatch])
  const handleLoadModels = useCallback(() => {
    dispatch(listOpenAiModels())
  }, [dispatch])
  
  return (
    <Fieldset className="w-full space-y-6">
      <Field>
        <Label className={labelClasses}>API Key <span className="text-red-500">*</span></Label>
        <Description className={descriptionClasses}>
          See <span
          className={"bg-black/5 dark:bg-white/5 px-2 py-1 rounded"}>https://platform.openai.com/api-keys</span> for
          more information
        </Description>
        <Input
          required
          type="password"
          value={providers.openAi?.apiKey}
          onChange={handleValueChange}
          className={inputClasses}
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
      <div className={"flex flex-col"}>
        <button className={"flex flex-row gap-4"}>
          <span>Loaded Models</span>
          <ArrowPathIcon onClick={handleLoadModels}
                         className={"max-h-6 border hover:shadow transition-shadow w-fit text-nowrap rounded"}>Add
            models</ArrowPathIcon>
        </button>
        <div className={"flex flex-col"}>
          {
            models.map(model => <span key={model}>{model}</span>)
          }
        </div>
      </div>
    </Fieldset>
  )
}
