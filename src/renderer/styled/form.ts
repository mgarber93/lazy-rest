import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const Group = styled.div`
  padding: 0.5rem 0;
`

export const Label = styled.div`
`

export const Control = styled.input`
  outline-color: rgb(87, 99, 112);
  background-color: rgba(34, 37, 28, 0.17);
  margin-top: 0.5rem;
  outline-width: 0;
  border: 2px solid var(--primary-3);
  border-radius: var(--border-radius);
  -moz-text-decoration-color: var(--background-color-9);

  &:hover, &:focus-within, &:active {
    outline-color: rgb(87, 99, 112);
  }

  transition: 1s ease-in-out background-color;
  width: 100%;
  padding: 0.4rem 1rem;
`
export const Footer = styled.div`
  padding: 0;
  margin-top: auto;
`

export const Header = styled.header`
  font-size: larger;
`

export const Submit = styled.button`
`