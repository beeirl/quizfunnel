import { cn } from '@/lib/utils'
import type { ImageBlock as BlockType } from '@shopfunnel/core/quiz/types'
import { IconPhoto as PhotoIcon } from '@tabler/icons-react'

export interface ImageBlockProps {
  block: BlockType
  index: number
  static?: boolean
}

export function ImageBlock({ block, index, static: isStatic }: ImageBlockProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-(--qz-radius)',
        index > 0 && 'mt-6',
        !block.properties.url && 'flex aspect-video items-center justify-center bg-(--qz-muted)',
      )}
    >
      {block.properties.url && <img src={block.properties.url} alt="" className="h-auto w-full" />}
      {!block.properties.url && <PhotoIcon className="size-14 text-(--qz-foreground) opacity-20" />}
    </div>
  )
}
