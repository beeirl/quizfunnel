import { cn } from '@/lib/utils'
import { IconPhoto as PhotoIcon } from '@tabler/icons-react'
import * as React from 'react'

interface ImageDropzoneProps extends React.ComponentProps<'div'> {
  value?: string | null
  onValueChange?: (file: File) => void
}

function ImageDropzone({ className, value, onValueChange, ...props }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onValueChange?.(file)
  }

  const handleClick = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onValueChange?.(file)
  }

  return (
    <div
      data-slot="dropzone"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-muted transition-colors',
        isDragging ? 'border-ring' : 'border-border hover:border-ring/50',
        className,
      )}
      {...props}
    >
      {value ? (
        <img src={value} alt="" className="size-full object-cover" />
      ) : (
        <PhotoIcon className="size-10 opacity-30" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}

export { ImageDropzone }
