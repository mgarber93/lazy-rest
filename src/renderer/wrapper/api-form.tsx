import React, {ReactNode, SetStateAction, useCallback, useMemo, useState} from 'react'
import {parse} from 'yaml'
import {v4} from 'uuid'
import {OpenAPI} from 'openapi-types'
import {useAppDispatch} from '../features/store'
import {addApiConfiguration} from '../features/tools'

export function Center({children}: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1"></div>
      <div className="col-span-2 border-2 border-zinc-300 bg-zinc-100 rounded-2xl p-4">{children}</div>
      <div className="col-span-1"></div>
    </div>
  )
}

export function ApiForm() {
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
  
  const content = <form onSubmit={handleSubmit}>
    <label htmlFor="apiSpec" className="block mb-2 text-sm font-medium text-gray-700">
      Open Api Spec
    </label>
    <input id="apiSpec" type="file" accept=".json, .yaml" placeholder="Swagger OAS file"
           onChange={handleFile}
           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-4"/>
    <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
    <input type="text" placeholder="Api name (eg spotify)" value={name}
           onChange={(event: {
             target: { value: SetStateAction<string>; };
           }) => setName(event.target.value)}
           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg mb-4 p-2.5"/>
    <label className="block mb-2 text-sm font-medium text-gray-700">Base URL</label>
    <input type="text" placeholder="Base URL" value={baseUrl}
           onChange={(event: {
             target: { value: SetStateAction<string>; };
           }) => setBaseUrl(event.target.value)}
           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg mb-4 p-2.5"/>
    <label className="block mb-2 text-sm font-medium text-gray-700">Client ID</label>
    <input type="password" placeholder="Client ID" value={clientId}
           onChange={(event: {
             target: { value: SetStateAction<string>; };
           }) => setClientId(event.target.value)}
           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg mb-4 p-2.5"/>
    <label className="block mb-2 text-sm font-medium text-gray-700">Client Secret</label>
    <input type="password" placeholder="Client secret" value={clientSecret}
           onChange={(event: {
             target: { value: SetStateAction<string>; };
           }) => setClientSecret(event.target.value)}
           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg mb-4 p-2.5"/>
    <div className="flex justify-end">
      <button disabled={!isValid} type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">Save
      </button>
    </div>
  </form>
  
  return <Center>
    {content}
  </Center>
}
