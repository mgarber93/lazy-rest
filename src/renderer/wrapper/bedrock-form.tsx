import {Button, Description, Field, Fieldset, Input, Label} from '@headlessui/react'
import {ArrowPathIcon} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {ChangeEvent, useCallback} from 'react'
import {useAppDispatch, useAppSelector} from '../features/store'
import {configureBedrock, listBedrockModels} from '../features/models'
import {AppIconButton} from '../layouts/app-icon-button'
import {descriptionClasses, inputClasses, labelClasses} from '../components/api-form-element'


export function BedrockForm() {
  const models = useAppSelector(state => state.models.bedrockModels) ?? []
  const bedrockConfig = useAppSelector(state => state.models.providers.bedrock)
  const dispatch = useAppDispatch()

  const handleRegionChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const region = event.target.value
    dispatch(configureBedrock({
      region,
      accessKeyId: bedrockConfig?.accessKeyId || '',
      secretAccessKey: bedrockConfig?.secretAccessKey || '',
      sessionToken: bedrockConfig?.sessionToken
    }))
  }, [dispatch, bedrockConfig])

  const handleAccessKeyIdChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const accessKeyId = event.target.value
    dispatch(configureBedrock({
      region: bedrockConfig?.region || '',
      accessKeyId,
      secretAccessKey: bedrockConfig?.secretAccessKey || '',
      sessionToken: bedrockConfig?.sessionToken
    }))
  }, [dispatch, bedrockConfig])

  const handleSecretAccessKeyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const secretAccessKey = event.target.value
    dispatch(configureBedrock({
      region: bedrockConfig?.region || '',
      accessKeyId: bedrockConfig?.accessKeyId || '',
      secretAccessKey,
      sessionToken: bedrockConfig?.sessionToken
    }))
  }, [dispatch, bedrockConfig])

  const handleSessionTokenChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const sessionToken = event.target.value
    dispatch(configureBedrock({
      region: bedrockConfig?.region || '',
      accessKeyId: bedrockConfig?.accessKeyId || '',
      secretAccessKey: bedrockConfig?.secretAccessKey || '',
      sessionToken
    }))
  }, [dispatch, bedrockConfig])

  const handleLoadModels = useCallback(() => {
    dispatch(listBedrockModels())
  }, [dispatch])

  return (
    <Fieldset className="w-full space-y-6">
      <Field>
        <Label className={labelClasses}>Region <span className="text-red-500">*</span></Label>
        <Description className={descriptionClasses}>
          AWS region (e.g., us-east-1, us-west-2)
        </Description>
        <Input
          required
          type="text"
          value={bedrockConfig?.region || ''}
          onChange={handleRegionChange}
          className={inputClasses}
        />
      </Field>

      <Field>
        <Label className={labelClasses}>Access Key ID <span className="text-red-500">*</span></Label>
        <Description className={descriptionClasses}>
          Your AWS access key ID
        </Description>
        <Input
          required
          type="text"
          value={bedrockConfig?.accessKeyId || ''}
          onChange={handleAccessKeyIdChange}
          className={inputClasses}
        />
      </Field>

      <Field>
        <Label className={labelClasses}>Secret Access Key <span className="text-red-500">*</span></Label>
        <Description className={descriptionClasses}>
          Your AWS secret access key
        </Description>
        <Input
          required
          type="password"
          value={bedrockConfig?.secretAccessKey || ''}
          onChange={handleSecretAccessKeyChange}
          className={inputClasses}
        />
      </Field>

      <Field>
        <Label className={labelClasses}>Session Token</Label>
        <Description className={descriptionClasses}>
          Optional AWS session token (for temporary credentials)
        </Description>
        <Input
          type="password"
          value={bedrockConfig?.sessionToken || ''}
          onChange={handleSessionTokenChange}
          className={inputClasses}
        />
      </Field>

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
