import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const Group = styled.div`
  padding: 1rem;
`

export const Label= styled.div`
`

export const Control = styled.input`
  outline-color: $primary-7;
  background-color: $primary-3;
  margin-top: 1rem;
  &:hover, &:focus-within, &:active {
    background-color: $primary-6;
  }
  transition: 1s ease-in-out background-color;
  width: 100%;
  padding: 0.1rem 0.2rem;
`
export const Footer = styled.div`
  padding: 10px;
  margin-top: auto;
`