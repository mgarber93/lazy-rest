import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  display: flex;
  align-items: center;
`
const Button = styled.button`
  margin-left: auto;
  margin-right: 0;
`
const Header = styled.header`
`
const Body = styled.body`
`
const ToastContainer = styled.div`
`
const Toast = styled.div`
`

function Toasts() {
  return (
    <ToastContainer className="p-3" style={{zIndex: 1}}>
      <Toast>
        <Header>
          <strong className="me-auto">Approval Needed</strong>
          <small>11 mins ago</small>
        </Header>
        <Body>
          <Div>
            <span className={"text-highlight"}><span>GET</span> /search?q=Nicki+Minaj</span>
            <Button>Approve</Button>
          </Div>
        </Body>
      </Toast>
    </ToastContainer>
  )
}

export default Toasts