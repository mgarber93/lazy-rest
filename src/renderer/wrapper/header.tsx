import styled from 'styled-components'
import {Link} from 'react-router-dom'

const Div = styled.div`
  position: sticky;
  top: 0px;
  -webkit-app-region: drag;
  padding: 0.4rem 1rem 0rem 5rem;
  font-size: smaller;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.1rem;
  height: 36px;

  .breadcrumb {
    margin-bottom: 0.5rem;
  }

  background-color: var(--background-color-0);
  min-height: 2rem;
  z-index: 3;
  border-bottom: 2px dashed var(--background-color-1);

  & * {
    -webkit-app-region: no-drag;
  }

  svg {
    padding: 0.2rem 0 0 3px;
    width: 3rem;
    height: 1.6rem;

    &:hover {
      background-color: var(--background-color-5);
    }
  }

  .active {
    background-color: var(--background-color-6);
    border-radius: 0.2rem;

    &:hover {
      background-color: var(--background-color-6);
    }
  }
`


export function Header(props: {activeRoute: string}) {
  const {activeRoute} = props
  // https://icons.getbootstrap.com/icons/house-fill/
  return <Div>
    <Link to={"/home"}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={activeRoute === '/home' ? 'active' : ''}
           viewBox="0 0 20 20">
        <path
          d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
        <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
      </svg>
    </Link>
    <Link to={"/conversations"}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={activeRoute === '/conversations' ? 'active' : ''}
           viewBox="0 0 20 20">
        <path
          d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .320.320l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
      </svg>
    </Link>
  </Div>
}