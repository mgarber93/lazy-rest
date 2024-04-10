import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {OpenAiConfiguration} from '../../models/provider-config';
import {configureOpenAi} from '../features/models';
import {useAppDispatch, useAppSelector} from '../features/store';


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
      <h5>Open AI</h5>
      <Form.Group className="mb-lg-2">
        <Form.Label>API Key</Form.Label>
        <Form.Control
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          required/>
      </Form.Group>
      <Form.Group className="mb-lg-2">
        <Form.Label>Base URL (optional)</Form.Label>
        <Form.Control
          type="text"
          value={baseUrl}
          onChange={e => setBaseUrl(e.target.value)}
        />
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button variant="primary" type="submit" size={"sm"}>Submit</Button>
      </div>
    </Form>);
}

export default OpenAiConfigForm;