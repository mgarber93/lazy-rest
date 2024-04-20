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
  padding-top: 10rem;
  position: relative;
  height: 100%;
  overflow: auto;
  background: var(--background-gradient);
  min-height: 100vh;
  .reset {
    position: absolute;
    top: 0.1rem; /* placed after padding-top of the parent */
    left: 0; /* to match the parent's left edge */
    right: 0; /* to match the parent's right edge */
    bottom: 0; /* to match the parent's bottom edge */
    display: flex;
    flex-direction: column;
    gap: 6rem;
    overflow: auto; /* to handle its own inner overflow */
    padding: 5rem;

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