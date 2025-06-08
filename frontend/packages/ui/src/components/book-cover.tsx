import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"

export interface BookCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  tags: string[]
  content?: string
  size?: "sm" | "md" | "lg"
  color?: "blue" | "red" | "green" | "purple" | "orange" | "teal" | "pink" | "indigo" | "brown" | "gray"
  onTagClick?: (tag: string) => void
}

const sizeVariants = {
  sm: "w-32 h-44",
  md: "w-40 h-52", 
  lg: "w-44 h-56"
}

const colorVariants = {
  blue: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 border-blue-800",
  red: "bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-red-800",
  green: "bg-gradient-to-br from-green-400 via-green-500 to-green-700 border-green-800",
  purple: "bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 border-purple-800",
  orange: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 border-orange-800",
  teal: "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 border-teal-800",
  pink: "bg-gradient-to-br from-pink-400 via-pink-500 to-pink-700 border-pink-800",
  indigo: "bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-700 border-indigo-800",
  brown: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-amber-950",
  gray: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 border-gray-800"
}

const BookCover = React.forwardRef<HTMLDivElement, BookCoverProps>(
  ({ 
    title, 
    tags, 
    content,
    size = "md",
    color,
    onTagClick,
    className,
    ...props 
  }, ref) => {
    // タイトルから色を決定する簡単なハッシュ関数
    const getColorFromTitle = (title: string): keyof typeof colorVariants => {
      const colors = Object.keys(colorVariants) as Array<keyof typeof colorVariants>
      const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return colors[hash % colors.length]
    }

    const bookColor = color || getColorFromTitle(title)
    const truncatedContent = content && content.length > 80 ? content.substring(0, 80) + '...' : content

    return (
      <div
        ref={ref}
        className={cn(
          "relative cursor-pointer transition-all duration-300 group",
          "hover:shadow-2xl hover:-translate-y-2 hover:rotate-1",
          "transform-gpu perspective-1000",
          className
        )}
        {...props}
      >
        {/* 本の影 */}
        <div className="absolute -bottom-2 -right-2 w-full h-full bg-black/30 rounded-lg blur-sm" />
        
        {/* 本の厚み（側面） */}
        <div className="absolute top-1 -right-1 w-2 h-full bg-gradient-to-r from-black/20 to-black/40 rounded-r-lg transform skew-y-1" />
        
        {/* 本体（表紙） */}
        <div className={cn(
          "relative shadow-xl border-2 rounded-lg overflow-hidden",
          "flex flex-col justify-between p-4",
          sizeVariants[size],
          colorVariants[bookColor],
        )}>
          {/* 表紙の質感オーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
          
          {/* 光沢効果 */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/30 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {/* 上部：タイトルエリア */}
          <div className="relative z-10 flex-1 flex flex-col justify-start">
            {/* タイトル背景で可読性を向上 */}
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-black/30 rounded-md blur-sm" />
              <h3 className="relative text-white font-bold text-base leading-tight px-2 py-1 drop-shadow-lg">
                {title}
              </h3>
            </div>
            
            {/* 内容のプレビュー */}
            {content && (
              <div className="relative">
                <div className="absolute inset-0 bg-black/20 rounded-md blur-sm" />
                <p className="relative text-white/95 text-xs leading-relaxed drop-shadow-sm line-clamp-3 px-2 py-1">
                  {truncatedContent}
                </p>
              </div>
            )}
          </div>

          {/* 中央部：装飾的な区切り線 */}
          <div className="relative z-10 my-4">
            <div className="w-full h-px bg-white/40" />
            <div className="w-2/3 h-px bg-white/20 mt-1" />
          </div>

          {/* 下部：タグエリア */}
          <div className="relative z-10 flex flex-col gap-2">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={cn(
                      "text-xs px-2 py-0.5 bg-white/90 text-gray-700 hover:bg-white cursor-pointer",
                      "shadow-sm transition-all duration-200",
                      onTagClick && "hover:scale-105"
                    )}
                    onClick={(e) => {
                      if (onTagClick) {
                        e.stopPropagation()
                        onTagClick(tag)
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 bg-white/70 text-gray-600"
                  >
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* 本の角の装飾 */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/30" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/30" />
          
          {/* ページの質感を表現する右端のライン */}
          <div className="absolute right-1 top-2 bottom-2 w-px bg-white/20" />
          <div className="absolute right-2 top-3 bottom-3 w-px bg-white/10" />
        </div>
      </div>
    )
  }
)
BookCover.displayName = "BookCover"

export { BookCover }