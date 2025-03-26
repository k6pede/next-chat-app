import { z } from 'zod'

// TODO:バリデーションルール実装
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MessageSchemaDef = z.object({
  id: z.string(),
  room: z.number(),
  author: z.string(),
  body: z.string(),
})

// Zodのデータモデルから型定義を生成
type Message = z.infer<typeof MessageSchemaDef>
export default Message
