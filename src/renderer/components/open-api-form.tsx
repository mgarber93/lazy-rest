import React, {useCallback, useEffect} from 'react'
import {configureOpenAi} from '../features/models'
import {useAppDispatch, useAppSelector} from '../features/store'
import {Control, Form, Group, Header, Label} from '../styled/form'
import {OpenAiConfiguration} from '../../models/provider-config'

function OpenAiConfigForm() {
  const providerConfig = useAppSelector(state => state.models.providers.openAi)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(configureOpenAi({apiKey: providerConfig?.apiKey ?? '', baseUrl: providerConfig?.baseUrl ?? ''}))
  }, [])
  const currentOpenAiConfig = useAppSelector(
    state => state.models.providers.openAi,
  )
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    const config = {...currentOpenAiConfig} as OpenAiConfiguration
    config[name as keyof OpenAiConfiguration] = value
    dispatch(configureOpenAi(config))
  }, [dispatch, currentOpenAiConfig])
  
  return (
    <Form>
      <Header className="mb-lg-2">
        <div className="form">
          Open AI
        </div>
      </Header>
      <Group className="mb-lg-2">
        <Label>Key</Label>
        <Control
          name="apiKey"
          type="password"
          value={providerConfig?.apiKey || ''}
          onChange={handleChange}
          required/>
      </Group>
      <Group className="mb-lg-2">
        <Label>Base URL (optional)</Label>
        <Control
          name="baseUrl"
          type="text"
          value={providerConfig?.baseUrl || ''}
          onChange={handleChange}
        />
      </Group>
    </Form>)
}

export default OpenAiConfigForm
