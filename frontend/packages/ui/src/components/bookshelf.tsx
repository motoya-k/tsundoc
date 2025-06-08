import * as React from "react"
import { cn } from "@/lib/utils"

export interface BookshelfProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  rows?: number
  shelfColor?: "wood" | "white" | "dark"
}

const shelfColorVariants = {
  wood: "bg-gradient-to-b from-amber-200 to-amber-300 border-amber-400",
  white: "bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300", 
  dark: "bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600"
}

const Bookshelf = React.forwardRef<HTMLDivElement, BookshelfProps>(
  ({ children, rows = 1, shelfColor = "wood", className, ...props }, ref) => {
    // 子要素を行数で分割
    const childrenArray = React.Children.toArray(children)
    const itemsPerRow = Math.ceil(childrenArray.length / rows)
    const shelves = Array.from({ length: rows }, (_, index) => 
      childrenArray.slice(index * itemsPerRow, (index + 1) * itemsPerRow)
    )

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {shelves.map((shelfItems, shelfIndex) => (
          <div key={shelfIndex} className="relative mb-4">
            {/* 本棚の背景 */}
            <div className={cn(
              "relative bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg px-6 py-4 min-h-[240px]",
              "shadow-inner"
            )}>
              {/* 本棚の背板の木目模様 */}
              <div className="absolute inset-0 opacity-15 rounded-lg" 
                   style={{
                     backgroundImage: `repeating-linear-gradient(
                       90deg,
                       transparent,
                       transparent 3px,
                       rgba(139, 69, 19, 0.1) 3px,
                       rgba(139, 69, 19, 0.1) 6px
                     ),
                     repeating-linear-gradient(
                       0deg,
                       transparent,
                       transparent 8px,
                       rgba(160, 82, 45, 0.05) 8px,
                       rgba(160, 82, 45, 0.05) 16px
                     )`
                   }} 
              />
              
              {/* 本たち */}
              <div className="relative flex items-end justify-start gap-2 h-full pt-4">
                {shelfItems.map((child, index) => (
                  <React.Fragment key={index}>
                    {child}
                  </React.Fragment>
                ))}
                
                {/* 空のスペースを埋めるブックエンド */}
                {shelfItems.length < 8 && (
                  <div className="flex-1 flex justify-end">
                    <div className={cn(
                      "w-8 h-44 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-500 border-2 border-slate-600 rounded-sm",
                      "flex items-center justify-center shadow-lg relative"
                    )}>
                      {/* ブックエンドの装飾 */}
                      <div className="absolute inset-1 border border-slate-500/30 rounded-sm" />
                      <div className="text-slate-700 text-sm font-bold transform -rotate-90">📚</div>
                      {/* ブックエンドの重み感を表現 */}
                      <div className="absolute -bottom-1 -right-1 w-full h-2 bg-black/20 rounded-b-sm transform translate-x-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 本棚の棚板 */}
            <div className={cn(
              "h-3 -mt-1 border-t-2 border-l-2 border-r-2 rounded-t-lg shadow-md",
              shelfColorVariants[shelfColor]
            )} />
            
            {/* 棚の影 */}
            <div className="h-1 bg-black/10 rounded-b-sm" />
          </div>
        ))}
      </div>
    )
  }
)
Bookshelf.displayName = "Bookshelf"

export { Bookshelf }