import {PageContainer} from '../wrapper/responder-type/page-container';
import React from 'react';
import OpenAiConfigForm from '../components/open-api-form';
import {Card} from '../wrapper/card';
import styled from 'styled-components';

const Section = styled.section`
  padding: 1rem;

  .flex-row {
    display: flex;
    flex-direction: row;
  }


  .card {
    max-width: 600px;
  }

  section {
    display: flex;
    flex-direction: column;
  }

  &.blur {
    filter: blur(1px);
  }

  *.background {
    position: absolute;
  }

  &.primary {
    background-color: rgba(112, 128, 144, 0.3); // rgba for slategray
  }

  &.secondary {
    background-color: #729EA120;
  }

  &.tertiary {
    background-color: rgba(223, 190, 153, 0.15);
  }
`

function ApiCard() {
  return <span>hello world</span>;
}

export function ApiIntegration(props: { background: string }) {
  return <Section className={`p-5 ${props.background}`}>
    <div>
      <h4>Api</h4>
      <div className="flex-row">
        <Card>
          <ApiCard/>
        </Card>
      </div>
    </div>
  </Section>;
}

export function Home() {
  return (
    <PageContainer>
      <div className={"h-100 d-flex flex-md-column justify-content-around p-5"}>
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
    </PageContainer>
  );
}