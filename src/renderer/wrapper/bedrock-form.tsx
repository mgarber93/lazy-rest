import {Button, Fieldset} from '@headlessui/react'
import {ArrowPathIcon} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {useCallback} from 'react'
import {useAppDispatch, useAppSelector} from '../features/store'
import {listBedrockModels} from '../features/models'
import {AppIconButton} from '../layouts/app-icon-button'


export function BedrockForm() {
  const models = useAppSelector(state => state.models.bedrockModels) ?? []
  const dispatch = useAppDispatch()
  const handleLoadModels = useCallback(() => {
    dispatch(listBedrockModels())
  }, [dispatch])
  return (
    <Fieldset>
      <div className={"flex flex-col"}>
        <Button className={"flex flex-row gap-4"}>
          <div className={"w-full"}>
            <span>Loaded Models</span>
            <AppIconButton>
              <ArrowPathIcon
                onClick={handleLoadModels}
                className={clsx(
                  "max-h-6 border dark:border-transparent hover:shadow transition-shadow w-fit text-nowrap rounded",
                )}>
                Add models
              </ArrowPathIcon>
            </AppIconButton>
          </div>
        </Button>
        <div className={"flex flex-col"}>
          {
            models.map(model => <span key={model}>{model}</span>)
          }
        </div>
      </div>
    </Fieldset>
  )
}
