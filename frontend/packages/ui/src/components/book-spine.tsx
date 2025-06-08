import * as React from "react"
import { cn } from "@/lib/utils"

export interface BookSpineProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  tags: string[]
  height?: "sm" | "md" | "lg" | "xl"
  color?: "blue" | "red" | "green" | "purple" | "orange" | "teal" | "pink" | "indigo"
  onTagClick?: (tag: string) => void
}

const heightVariants = {
  sm: "h-36",
  md: "h-44", 
  lg: "h-52",
  xl: "h-60"
}

const colorVariants = {
  blue: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 border-blue-700 shadow-blue-800/50",
  red: "bg-gradient-to-r from-red-500 via-red-400 to-red-600 border-red-700 shadow-red-800/50",
  green: "bg-gradient-to-r from-green-500 via-green-400 to-green-600 border-green-700 shadow-green-800/50",
  purple: "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 border-purple-700 shadow-purple-800/50",
  orange: "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 border-orange-700 shadow-orange-800/50",
  teal: "bg-gradient-to-r from-teal-500 via-teal-400 to-teal-600 border-teal-700 shadow-teal-800/50",
  pink: "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 border-pink-700 shadow-pink-800/50",
  indigo: "bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600 border-indigo-700 shadow-indigo-800/50"
}

const BookSpine = React.forwardRef<HTMLDivElement, BookSpineProps>(
  ({ 
    title, 
    tags, 
    height = "md",
    color = "blue",
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

    const spineColor = color || getColorFromTitle(title)

    return (
      <div
        ref={ref}
        className={cn(
          "relative cursor-pointer transition-all duration-300 group",
          "hover:shadow-xl hover:-translate-y-2 hover:rotate-1",
          className
        )}
        {...props}
      >
        {/* 本の影 */}
        <div className="absolute -bottom-1 -right-1 w-full h-full bg-black/20 rounded-sm transform translate-x-1 translate-y-1" />
        
        {/* 本体 */}
        <div className={cn(
          "w-12 relative shadow-lg",
          "border-l-4 border-r-2 border-t-2 border-b-2 rounded-sm",
          "flex flex-col justify-between px-2 py-3",
          heightVariants[height],
          colorVariants[spineColor],
        )}>
          {/* 上部の装飾 */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-px bg-white/50" />
            <div className="w-4 h-px bg-white/30" />
          </div>

          {/* 本のタイトル（縦書き風） */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div 
              className="text-white text-xs font-bold text-center writing-mode-vertical"
              style={{ 
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                letterSpacing: "0.05em"
              }}
            >
              <span className="block text-[11px] leading-tight max-w-[140px] overflow-hidden text-ellipsis drop-shadow-sm">
                {title}
              </span>
            </div>
          </div>

          {/* タグインジケーター */}
          {tags.length > 0 && (
            <div className="flex flex-col gap-1 items-center">
              {tags.slice(0, 3).map((tag) => (
                <div
                  key={tag}
                  className={cn(
                    "w-6 h-1.5 rounded-full bg-white/90 cursor-pointer hover:bg-white transition-all duration-200",
                    "shadow-sm",
                    onTagClick && "hover:scale-110 hover:shadow-md"
                  )}
                  onClick={(e) => {
                    if (onTagClick) {
                      e.stopPropagation()
                      onTagClick(tag)
                    }
                  }}
                  title={tag}
                />
              ))}
              {tags.length > 3 && (
                <div className="w-3 h-3 rounded-full bg-white/70 shadow-sm flex items-center justify-center" title={`+${tags.length - 3} more tags`}>
                  <span className="text-[6px] text-gray-600 font-bold">+</span>
                </div>
              )}
            </div>
          )}

          {/* 下部の装飾 */}
          <div className="flex flex-col items-center gap-1 mt-2">
            <div className="w-4 h-px bg-white/30" />
            <div className="w-6 h-px bg-white/50" />
          </div>

          {/* 本の質感を表現する縦線 */}
          <div className="absolute left-1 top-0 bottom-0 w-px bg-white/20" />
          <div className="absolute right-1 top-0 bottom-0 w-px bg-black/10" />
          
          {/* ページの厚みを表現 */}
          <div className="absolute -right-1 top-1 bottom-1 w-1 bg-gradient-to-r from-white/10 to-transparent rounded-r-sm" />
        </div>
      </div>
    )
  }
)
BookSpine.displayName = "BookSpine"

export { BookSpine }