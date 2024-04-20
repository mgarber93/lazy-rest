import React from 'react';
import styled from 'styled-components';
import {PageContainer} from '../wrapper/responder-type/page-container';
import OpenAiConfigForm from '../components/open-api-form';
import {Card} from '../wrapper/card';
import {ApiIntegration, Section} from '../wrapper/form-group';

const Div = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding-top: 10rem;
  position: relative;
  .reset {
    position: absolute;
    top: 1rem;
  }
`;


export function Home() {
  return (
    <PageContainer activeRoute={"/home"}>
      <Div className={"h-100 d-flex flex-md-column justify-content-around p-5"}>
        <div className="reset">
          <Section className="provider b1">
            <h4>Providers</h4>
            <div className="flex-row provider">
              <Card>
                <OpenAiConfigForm/>
              </Card>
            </div>
          </Section>
          <ApiIntegration background={'primary'}/>
        </div>

      </Div>
    </PageContainer>
  );
}