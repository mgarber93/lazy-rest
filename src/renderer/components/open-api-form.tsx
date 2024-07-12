import React, {useCallback, useEffect} from 'react'
import {configureOpenAi} from '../features/models'
import {useAppDispatch, useAppSelector} from '../features/store'
import {Control, Footer, Form, Group, Header, Label} from '../styled/form'
import {Button} from '../styled/button'

function OpenAiConfigForm() {
  const providerConfig = useAppSelector(state => state.models.providers.openAi)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(configureOpenAi({apiKey: providerConfig.apiKey ?? '', baseUrl: providerConfig.baseUrl ?? ''}))
  }, [])
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    
    // use fresh state inside the dispatcher. need to deep copy?
    const freshProviderConfig = useAppSelector(
      state => state.models.providers.openAi,
    )
    
    dispatch(configureOpenAi({...freshProviderConfig, [name]: value}))
  }, [dispatch]) // corrected dependencies array
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  
  return (
    <Form onSubmit={handleSubmit}>
      <Header className="mb-lg-2">
        <div className="form">
          Open AI
        </div>
        <div className="helper-text">
        
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
      <Footer>
        <Button type="submit">Save</Button>
      </Footer>
    </Form>)
}

export default OpenAiConfigForm
