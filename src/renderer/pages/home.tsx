import React from 'react';
import styled from 'styled-components';
import {PageContainer} from '../wrapper/responder-type/page-container';
import OpenAiConfigForm from '../components/open-api-form';
import {Card} from '../wrapper/card';
import {ApiForm} from '../components/api-form';
import {FormGroup} from '../wrapper/form-group';

const Div = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding-top: 10rem;
  position: relative;
  height: 100%;
  .reset {
    top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;


export function Home() {
  return (
    <PageContainer activeRoute={"/home"}>
      <Div className={"h-100 d-flex flex-md-column justify-content-around p-5"}>
        <div className="reset">
          <FormGroup name={"Providers"}>
            <Card>
              <OpenAiConfigForm/>
            </Card>
          </FormGroup>
          <FormGroup name={"Api Integrations"}>
            <Card>
              <ApiForm></ApiForm>
            </Card>
          </FormGroup>
        </div>

      </Div>
    </PageContainer>
  );
}