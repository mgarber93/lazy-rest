import {ApiFormElement} from '../components/api-form-element'
import {useEffect, useState} from 'react'
import {Fieldset} from '@headlessui/react'

export type AuthFormProps = {
  baseUrl: string
  clientId: string
  clientSecret: string
  onSave: (baseUrl: string, clientId: string, clientSecret: string) => void
}

export function AuthForm(props: AuthFormProps) {
  const [baseUrl, setBaseUrl] = useState<string>(props.baseUrl)
  const [clientId, setClientId] = useState<string>(props.clientId)
  const [clientSecret, setClientSecret] = useState<string>(props.clientSecret)
  
  useEffect(() => {
    if (!baseUrl || !clientId || !clientSecret) return

    props.onSave(baseUrl, clientId, clientSecret)
  }, [baseUrl, clientId, clientSecret, props.onSave])

  return <Fieldset className="flex flex-col gap-y-1">
    <ApiFormElement
      label="Base URL"
      placeholder="Enter Base URL"
      domName={"baseUrl"}
      changeHandler={(e) => setBaseUrl(e.target?.value ?? '')}
      value={baseUrl}
      type={"text"}
    />
    <ApiFormElement
      label="Client ID"
      placeholder="Enter Client ID"
      domName={"clientId"}
      changeHandler={e => setClientId(e.target?.value ?? '')}
      value={clientId}
      type={"text"}
    />
    <ApiFormElement
      label="Client Secret"
      placeholder="Enter Client Secret"
      domName={"clientSecret"}
      changeHandler={e => setClientSecret(e.target?.value ?? '')}
      value={clientSecret}
      type={"password"}
    />
  </Fieldset>
}
