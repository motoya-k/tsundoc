import * as React from "react"
import { cn } from "@/lib/utils"

export interface BookLibraryProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: number
  showShelf?: boolean
  shelfColor?: "wood" | "white" | "dark"
}

const shelfColorVariants = {
  wood: "bg-gradient-to-b from-amber-200 to-amber-300 border-amber-400",
  white: "bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300", 
  dark: "bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600"
}

const BookLibrary = React.forwardRef<HTMLDivElement, BookLibraryProps>(
  ({ 
    children, 
    columns = 4, 
    showShelf = true,
    shelfColor = "wood", 
    className, 
    ...props 
  }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const rows = Math.ceil(childrenArray.length / columns)
    const shelves = Array.from({ length: rows }, (_, index) => 
      childrenArray.slice(index * columns, (index + 1) * columns)
    )

    if (!showShelf) {
      // シンプルなグリッドレイアウト
      return (
        <div
          ref={ref}
          className={cn(
            "grid gap-6",
            `grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`,
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("w-full space-y-8", className)}
        {...props}
      >
        {shelves.map((shelfItems, shelfIndex) => (
          <div key={shelfIndex} className="relative">
            {/* 本棚の背景 */}
            <div className={cn(
              "relative bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg px-8 py-6 min-h-[280px]",
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
              <div className="relative flex items-end justify-start gap-4 h-full pt-6">
                {shelfItems.map((child, index) => (
                  <React.Fragment key={index}>
                    {child}
                  </React.Fragment>
                ))}
                
                {/* 空のスペースが多い場合の装飾 */}
                {shelfItems.length < columns * 0.7 && (
                  <div className="flex-1 flex justify-end items-end">
                    {/* 装飾的な小物 */}
                    <div className="flex items-end gap-2">
                      <div className="w-6 h-12 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm border border-amber-900 shadow-lg" title="本立て">
                        <div className="mt-2 mx-1 h-1 bg-amber-400 rounded-full" />
                      </div>
                      <div className="w-4 h-8 bg-gradient-to-b from-green-600 to-green-800 rounded-sm shadow-md" title="小さな飾り" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 本棚の棚板 */}
            <div className={cn(
              "h-4 -mt-2 border-t-2 border-l-2 border-r-2 rounded-t-lg shadow-lg",
              shelfColorVariants[shelfColor]
            )}>
              {/* 棚板の木目 */}
              <div className="h-full w-full opacity-20 rounded-t-lg"
                   style={{
                     backgroundImage: `repeating-linear-gradient(
                       90deg,
                       transparent,
                       transparent 4px,
                       rgba(139, 69, 19, 0.3) 4px,
                       rgba(139, 69, 19, 0.3) 8px
                     )`
                   }}
              />
            </div>
            
            {/* 棚の影 */}
            <div className="h-2 bg-gradient-to-b from-black/20 to-transparent rounded-b-lg" />
          </div>
        ))}
      </div>
    )
  }
)
BookLibrary.displayName = "BookLibrary"

export { BookLibrary }