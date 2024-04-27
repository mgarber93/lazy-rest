import React from 'react'

export interface TreeNodeDisplay {
  id: string;
  name: string;
  children: TreeNodeDisplay[];
}

const nodeSize = 30
const verticalSpacing = 80

function RenderNode({node, x, y, level}: { node: TreeNodeDisplay, x: number, y: number, level: number }) {
  const horizontalSpacing = Math.pow(2, level) * 40
  const elements = [
    <circle key={node.id} cx={x} cy={y} r={nodeSize / 2} fill="transparent"/>,
    <text key={`text-${node.id}`} x={x} y={y + 5} fill="white" fontSize="12" textAnchor="middle">
      {node.name}
    </text>,
  ]
  
  if (node.children) {
    node.children.forEach((child, index) => {
      const childX = x + (index - Math.floor(node.children.length / 2)) * horizontalSpacing
      const childY = y + verticalSpacing
      
      // Connect the current node to its child
      elements.push(
        <line key={`line-${node.id}-${child.id}`} x1={x} y1={y} x2={childX} y2={childY} stroke="black"/>,
      )
      
      // Render the child node
      const children = RenderNode({node: child, x: childX, y: childY, level: level + 1})
      elements.push(...children)
    })
  }
  
  return elements
}

function TreeChart({node}: { node: TreeNodeDisplay }) {
  const nodes = RenderNode({node, x: 50, y: 50, level: 0})
  return (
    <svg width="1000" height="600" viewBox="0 0 1000 600">
      {nodes.map(node => node)}
    </svg>
  )
}

export default TreeChart
