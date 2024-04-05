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
`

export function Home() {
  return (
    <PageContainer>
      <Section>
        <h4>Providers</h4>
        <div className="providers">
          <Card>
            <OpenAiConfigForm/>
          </Card>
        </div>
      </Section>
    </PageContainer>
  );
}