import React from 'react'
import {AuthoredContent} from '../../models/content'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {useAppSelector} from '../features/store'
import {Card} from '../wrapper/card'


export function Message({content}: { content: AuthoredContent }) {
  const userName = useAppSelector(state => state.user?.username)
  const {author} = content
  const isUser = author === userName
  
  const node = <div>
    <div className="content">
      <Markdown remarkPlugins={[remarkGfm]}>{content.message}</Markdown>
    </div>
    {
      author && <p className={"author"}>
        {author.split('-').reverse().slice(0, 2).reverse().join(' ')}
      </p>
    }
  </div>
  
  return <Card>{node}</Card>
}
