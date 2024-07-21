import {ReactNode, useCallback, useRef, useState} from 'react'

export function PageContainer(props: { children: ReactNode, activeRoute: string }) {
  const myRef = useRef<HTMLDivElement | null>(null)
  const [scrollPos, setScrollPos] = useState(0)
  
  const handleScroll = useCallback(() => {
    if(myRef.current) {
      const {scrollTop} = myRef.current as {scrollTop: number}
      setScrollPos(scrollTop)
    }
  }, [myRef, scrollPos])
  
  // @todo set in redux to persist
  return (
    <div ref={myRef} onScroll={handleScroll}>
      {props.children}
    </div>
  )
}
