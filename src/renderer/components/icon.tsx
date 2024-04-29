import styled from 'styled-components'

const SVG = styled.svg`

`

function Path({type}: { type: string }) {
  if (type === 'checkbox') {
    return <>
      <path
        d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z"
        stroke="#000000" stroke-width="1.5"></path>
      <path d="M7 12.5L10 15.5L17 8.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
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