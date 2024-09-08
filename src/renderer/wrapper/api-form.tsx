import React, {MutableRefObject, ReactNode, SetStateAction, useCallback, useMemo, useState} from 'react'
import {parse} from 'yaml'
import {v4} from 'uuid'
import {OpenAPI} from 'openapi-types'
import {useAppDispatch} from '../features/store'
import {addApiConfiguration} from '../features/tools'
import {CenterWithLabel} from './center'

export function ApiFormElement({domName, label, changeHandler, placeholder, type}: {
  domName: string,
  label: ReactNode,
  changeHandler: (...args: never[]) => void,
  placeholder: string,
  type: string
}) {
  return <CenterWithLabel>
    <div
      className="col-span-1 h-full items-center content-center text-sm text-zinc-600">
      <label htmlFor={domName}>{label}</label>
    </div>
    <div className="col-span-3 h-full items-center content-center">
      <input id={domName} type={type} accept=".json, .yaml" placeholder={placeholder}
             onChange={changeHandler}
             className={`w-full h-full text-sm rounded cursor-pointer bg-zinc-100 dark:bg-zinc-700 placeholder:text-zinc-900 placeholder-zinc-800 text-zinc-950 border-none`}
      />
    </div>
    <div className="col-span-1"></div>
  </CenterWithLabel>
}

export function ApiForm({sectionRefs}: {
  sectionRefs: Record<string, MutableRefObject<HTMLDivElement>>,
}) {
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [oas, setOas] = useState(null)
  const [fileHandle, setFileHandle] = useState('')
  const dispatch = useAppDispatch()
  
  const handleFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  
  return <form className={"flex flex-col col-span-3 gap-4"}>
    <div ref={sectionRefs.section1} id="section1" style={{height: '600px'}}>
      <h2>Section 1</h2>
      {/* Section 1 form fields */}
    </div>
    <div ref={sectionRefs.section2} id="section2" style={{height: '600px'}}>
      <h2>Section 2</h2>
      {/* Section 2 form fields */}
    </div>
    <div ref={sectionRefs.section3} id="section3" style={{height: '600px'}}>
      <h2>Section 3</h2>
      <ApiFormElement
        domName={'apiSpec'}
        label={'Open Api Spec'}
        placeholder={'Swagger OAS file'}
        changeHandler={handleFile}
        type={'file'}
      />
      <ApiFormElement
        domName={'baseUrl'}
        label={'Base URL'}
        placeholder={'Base URL'}
        changeHandler={(event: {
          target: { value: SetStateAction<string>; };
        }) => setBaseUrl(event.target.value)}
        type={'string'}
      />
      <ApiFormElement
        domName={'apiName'}
        label={'API Name'}
        placeholder={'Api name (eg spotify)'}
        changeHandler={(event: {
          target: { value: SetStateAction<string>; };
        }) => setName(event.target.value)}
        type={'string'}
      />
      <ApiFormElement
        domName={'clientId'}
        label={'Client ID'}
        placeholder={'Client ID to use'}
        changeHandler={(event: {
          target: { value: SetStateAction<string>; };
        }) => setClientId(event.target.value)}
        type={'string'}
      />
      <ApiFormElement
        domName={'clientSecret'}
        label={'Client Secret'}
        placeholder={'Client Secret to use'}
        changeHandler={(event: {
          target: { value: SetStateAction<string>; };
        }) => setClientSecret(event.target.value)}
        type={'password'}
      /></div>
  </form>
}
