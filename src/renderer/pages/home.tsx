import {PageContainer} from '../wrapper/responder-type/page-container';
import React from 'react';
import OpenAiConfigForm from '../components/open-api-form';
import {Card} from '../wrapper/card';
import styled from 'styled-components';

const Section = styled.section`
  padding: 1rem;

  .providers {
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

  .reset {
    filter: none !important;
  }

  *.background {
    position: absolute;
  }

  &.secondary {
    background-color: slategray;
  }
`

function ApiCard() {
  return <span>hello world</span>;
}

export function Home() {
  return (
    <PageContainer>
      <div className={"h-100 d-flex flex-md-column justify-content-around p-5"}>
        <Section>
          <h4>Providers</h4>
          <div className="providers">
            <Card>
              <OpenAiConfigForm/>
            </Card>
          </div>
        </Section>
        <Section className="p-5 secondary">
          <div className="background"></div>
          <div className="reset">
            <h4>Api</h4>
            <div className="providers">
              <Card>
                hello world
              </Card>
            </div>
          </div>
        </Section>
      </div>
    </PageContainer>
  );
}