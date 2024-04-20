import React, {useState} from 'react';
import {OpenAiConfiguration} from '../../models/provider-config';
import {configureOpenAi} from '../features/models';
import {useAppDispatch, useAppSelector} from '../features/store';
import {Control, Footer, Form, Group, Label, Header} from '../styled/form';
import {Button} from 'react-bootstrap';

function OpenAiConfigForm() {
  const providerConfig = useAppSelector(state => state.models.providers.openAi);
  const dispatch = useAppDispatch();
  const [apiKey, setApiKey] = useState(providerConfig?.apiKey ?? '');
  const [baseUrl, setBaseUrl] = useState(providerConfig?.baseUrl ?? '');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const config: OpenAiConfiguration = {apiKey, baseUrl};
    dispatch(configureOpenAi(config));
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Header>Open AI</Header>
      <Group className="mb-lg-2">
        <Label>Key</Label>
        <Control
          type="password"
          value={apiKey}
          onChange={(e: { target: { value: any; }; }) => setApiKey(e.target.value)}
          required/>
      </Group>
      <Group className="mb-lg-2">
        <Label>Base URL (optional)</Label>
        <Control
          type="text"
          value={baseUrl}
          onChange={(e: { target: { value: any; }; }) => setBaseUrl(e.target.value)}
        />
      </Group>
      <Footer>
        <Button variant="primary" type="submit" size={"sm"}>Submit</Button>
      </Footer>
    </Form>);
}

export default OpenAiConfigForm;