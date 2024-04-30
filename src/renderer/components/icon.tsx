import styled from 'styled-components'

const SVG = styled.svg`

`

function Path({type}: { type: string }) {
  if (type === 'checkbox') {
    return <>
      <path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round"></path>
    </>
  }
  if (type === 'erasure') {
    return <>
      <path d="M21 21L9 21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path
        d="M14.9142 3.41421L19.864 8.36396C20.645 9.14501 20.645 10.4113 19.864 11.1924L10.6213 20.435C10.2596 20.7968 9.76894 21 9.25736 21C8.74577 21 8.25514 20.7968 7.8934 20.435L2.8934 15.435C2.11235 14.654 2.11235 13.3877 2.8934 12.6066L7 8.5L11.75 13.25C12.4404 13.9404 13.5596 13.9404 14.25 13.25C14.9404 12.5596 14.9404 11.4404 14.25 10.75L9.5 6L12.0858 3.41421C12.8668 2.63317 14.1332 2.63317 14.9142 3.41421Z"
        fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </>
  }
  if (type === 'edit') {
    return <>
      <path
        d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942"
        stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </>
  }
  if (type === 'save') {
    return <>
      <path
        d="M3 6.5V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17.5"
        stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M8 3H16V8.4C16 8.73137 15.7314 9 15.4 9H8.6C8.26863 9 8 8.73137 8 8.4V3Z" stroke="#000000"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M18 21V13.6C18 13.2686 17.7314 13 17.4 13H15" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round"></path>
      <path d="M6 21V17.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M12 12H1M1 12L4 9M1 12L4 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round"></path>
    </>
  }
}

export function Icon({type}: { type: string }) {
  const height = 24
  const width = 24
  return <SVG width={`${height}px`} height={`${height}px`} viewBox={`0 0 ${height} ${width}`} stroke-width="1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg" color="#000000">
    <Path type={type}/>
  </SVG>
}