import styled from 'styled-components'
import {ReactNode, useCallback, useRef, useState} from 'react'
import {Header} from '../header'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: var(--background-color-0);
`

export function PageContainer(props: { children: ReactNode, activeRoute: string }) {
  const myRef = useRef()
  const [scrollPos, setScrollPos] = useState(0)
  
  const handleScroll = useCallback(() => {
    if(myRef.current) {
      const {scrollTop} = myRef.current as {scrollTop: number}
      setScrollPos(scrollTop)
    }
  }, [myRef, scrollPos])
  
  // @todo set in redux to persist
  return (
    <Container ref={myRef} onScroll={handleScroll}>
      <Header activeRoute={props.activeRoute}/>
      {props.children}
    </Container>
  )
}
