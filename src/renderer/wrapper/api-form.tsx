import React, {SetStateAction, useCallback, useMemo, useState} from 'react'
import {parse} from 'yaml'
import {v4} from 'uuid'
import {OpenAPI} from 'openapi-types'
import {useAppDispatch} from '../features/store'
import {addApiConfiguration, selectAllApiConfigurations} from '../features/tools'
import {Fieldset} from '@headlessui/react'
import {ApiFormElement} from '../components/api-form-element'
import {AppButton} from '../components/app-button'
import {AppCombobox} from '../components/app-combobox'
import {useSelector} from 'react-redux'
import {debug} from 'openai/core'

export function ApiForm() {
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [oas, setOas] = useState(null)
  const [fileHandle, setFileHandle] = useState('')
  const dispatch = useAppDispatch()
  
  const handleFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files ?? true) {
      console.log('unable to read file')
      return
    }
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const yaml = parse(reader.result as string) as OpenAPI.Document
        setName(yaml.info.contact?.name ?? '')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore the type must be wrong or something? Its on spotifies swagger
        setBaseUrl(yaml.servers[0].url)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setOas(yaml)
        const key = v4()
        setFileHandle(key)
      }
      reader.readAsText(file)  // You can read it as Array Buffer or Binary String alternatively
    }
  }, [setName, setBaseUrl, setOas, setFileHandle, dispatch])
  
  const isValid = useMemo(() => {
    return name && baseUrl && clientId && clientSecret && oas !== null
  }, [name, baseUrl, clientId, clientSecret, oas])
  
  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    localStorage.setItem(fileHandle, JSON.stringify(oas))
    dispatch(addApiConfiguration({key: fileHandle, configuration: {name, baseUrl, clientId, clientSecret, fileHandle}}))
  }, [dispatch, oas, name, baseUrl, clientId, clientSecret, fileHandle])
  
  const configs = useSelector(selectAllApiConfigurations)
  
  return <Fieldset className={"flex flex-col col-span-3 gap-4"}>
    <ApiFormElement
      domName={'apiSpec'}
      label={'Open Api Spec'}
      placeholder={'Swagger OAS file'}
      changeHandler={handleFile}
      type={'file'}
      value={''}
    />
    <ApiFormElement
      domName={'baseUrl'}
      label={'Base URL'}
      placeholder={'Base URL'}
      changeHandler={(event: {
        target: { value: SetStateAction<string>; };
      }) => setBaseUrl(event.target.value)}
      type={'string'}
      value={baseUrl}
    />
    <ApiFormElement
      domName={'apiName'}
      label={'API Name'}
      placeholder={'Api name (eg spotify)'}
      changeHandler={(event: {
        target: { value: SetStateAction<string>; };
      }) => setName(event.target.value)}
      type={'string'}
      value={name}
    />
    <ApiFormElement
      domName={'clientId'}
      label={'Client ID https://developer.spotify.com/dashboard'}
      placeholder={'Client ID to use'}
      changeHandler={(event: {
        target: { value: SetStateAction<string>; };
      }) => setClientId(event.target.value)}
      type={'string'}
      value={clientId}
    />
    <ApiFormElement
      domName={'clientSecret'}
      label={'Client Secret'}
      placeholder={'Client Secret to use'}
      changeHandler={(event: {
        target: { value: SetStateAction<string>; };
      }) => setClientSecret(event.target.value)}
      type={'password'}
      value={clientSecret}
    />
    <AppButton
      onClick={handleSubmit}
      disabled={!isValid}
      className={"ml-auto mr-4"}
    >
      Save
    </AppButton>
  </Fieldset>
}
