import React, {useCallback, useEffect} from 'react'
import {ClientOptions} from 'openai'
import {configureOpenAi} from '../features/models'
import {useAppDispatch, useAppSelector} from '../features/store'

function OpenAiConfigForm() {
  const providerConfig = useAppSelector(state => state.models.providers.openAi)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(configureOpenAi({apiKey: providerConfig?.apiKey ?? '', baseURL: providerConfig?.baseURL ?? ''}))
  }, [])
  const currentOpenAiConfig = useAppSelector(
    state => state.models.providers.openAi,
  )
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    const config = {...currentOpenAiConfig} as ClientOptions
    config[name as keyof ClientOptions] = value
    dispatch(configureOpenAi(config))
  }, [dispatch, currentOpenAiConfig])
  
  return (
    <form className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        Open AI
      </h2>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Key</label>
        <input
          name="apiKey"
          type="password"
          value={providerConfig?.apiKey || ''}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Base URL (optional)</label>
        <input
          name="baseUrl"
          type="text"
          value={providerConfig?.baseURL || ''}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </form>
  )
}

export default OpenAiConfigForm
