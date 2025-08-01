"use client"

import type React from "react"
import { memo, useCallback } from "react"
import { FixedSizeList as List } from "react-window"

interface VirtualListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
}

function VirtualListComponent<T>({ items, height, itemHeight, renderItem, keyExtractor }: VirtualListProps<T>) {
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style} key={keyExtractor(items[index])}>
        {renderItem(items[index], index)}
      </div>
    ),
    [items, renderItem, keyExtractor],
  )

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemKey={(index) => keyExtractor(items[index])}
    >
      {Row}
    </List>
  )
}

export const VirtualList = memo(VirtualListComponent) as typeof VirtualListComponent
