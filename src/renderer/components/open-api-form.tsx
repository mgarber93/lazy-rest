import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {OpenAiConfiguration} from '../../models/provider-config';


function OpenAiConfigForm() {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const config: OpenAiConfiguration = {apiKey, baseUrl};
    console.log(config);
    setApiKey('');
    setBaseUrl('');
  };
  return (
    <Form onSubmit={handleSubmit}>
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