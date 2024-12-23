import {ApiFormElement} from '../components/api-form-element'
import {useCallback, useState} from 'react'
import {Fieldset} from '@headlessui/react'

export function AuthForm() {
  const [baseUrl, setBaseUrl] = useState<string>("")
  const [clientId, setClientId] = useState<string>("")
  const [clientSecret, setClientSecret] = useState<string>("")
  const baseUrlCb = useCallback((v: string) => {
    setBaseUrl(v)
  }, [baseUrl, setBaseUrl])
  const clientIdCb = useCallback((v: string) => {
    setClientId(v)
  }, [clientId, setClientId])
  const clientSecretCb = useCallback((v: string) => {
    setClientSecret(v)
  }, [clientSecret, setClientSecret])
  return <Fieldset className="flex flex-col gap-y-1">
    <ApiFormElement
      label="Base URL"
      placeholder="Enter Base URL"
      domName={"baseUrl"}
      changeHandler={baseUrlCb}
      value={"https://api.openai.com/v1/"}
      type={"text"}
    />
    <ApiFormElement
      label="Client ID"
      placeholder="Enter Client ID"
      domName={"clientId"}
      changeHandler={clientIdCb}
      value={""}
      type={"text"}
    />
    <ApiFormElement
      label="Client Secret"
      placeholder="Enter Client Secret"
      domName={"clientSecret"}
      changeHandler={clientSecretCb}
      value={""}
      type={"password"}
    />
  </Fieldset>
}
