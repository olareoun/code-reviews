import * as L from 'lodash'

const getComplimentaryCoordinate = rowOrCol => rowOrCol === 'col' ? 'row' : 'col'

const getSpanKey = rowOrCol => `${rowOrCol}span`

const getSpan = (cell, rowOrCol) => cell[getSpanKey(rowOrCol)]

const hasSpan = (cell, rowOrCol) => !L.isNil(getSpan(cell, rowOrCol))

const mergedAreaIncludesCell = (mergedCell, rowOrCol, cell) =>
  mergedCell[rowOrCol] + mergedCell[getSpanKey(rowOrCol)] > cell[rowOrCol]

const isInRange = (cell, rowOrCol, index, amount) =>
  cell[rowOrCol] >= index && cell[rowOrCol] < index + amount

const willBeDeleted = (cell, rowOrCol, index, amount) =>
  isADeletion(amount) && isInRange(cell, rowOrCol, index, Math.abs(amount))

const hasSameComplimentaryCoordinate = (cell1, cell2, rowOrCol) =>
  cell1[getComplimentaryCoordinate(rowOrCol)] === cell2[getComplimentaryCoordinate(rowOrCol)]

const isNextToDeletedArea = (cell, rowOrCol, index, amount) =>
  cell[rowOrCol] === index + amount

const isADeletion = amount => amount < 0

const reallocateMergedCells = (cells, rowOrCol, index, amount) => {
  return L.map(cells, cell => {
    const isBeforeIndex = cell[rowOrCol] < index
    const expanded = hasSpan(cell, rowOrCol)
    const spanEnd = cell[rowOrCol] + getSpan(cell, rowOrCol)
    const isBeforeExpanded = spanEnd <= index
    const isAffected =    isBeforeIndex && expanded && !isBeforeExpanded

    if (!isADeletion(amount) && isAffected) {
      return { 
        ...cell, 
        [getSpanKey(rowOrCol)]: getSpan(cell, rowOrCol) + amount 
      }

      return cell
    }

    // deletion
    if (willBeDeleted(cell, rowOrCol, index, amount)) {
      return cell
    }

    const amountToDelete = -amount

    if (expanded && !isBeforeExpanded) {
      const countOfDeletedOutsideMergedArea = Math.max(0, index + amountToDelete - spanEnd)
      return {
        ...cell,
        [getSpanKey(rowOrCol)]: getSpan(cell, rowOrCol) - (amountToDelete - countOfDeletedOutsideMergedArea)
      }
    }

    if (isNextToDeletedArea(cell, rowOrCol, index, amountToDelete)) {
      const mergedCell = L.find(cells, potentialMergedCell => {
        const sameComplimentaryCoordinate = hasSameComplimentaryCoordinate(potentialMergedCell, cell, rowOrCol)
        const isBeingRemoved = willBeDeleted(potentialMergedCell, rowOrCol, index, amount)
        const hasrowOrColSpan = hasSpan(potentialMergedCell, rowOrCol)
        const included = mergedAreaIncludesCell(potentialMergedCell, rowOrCol, cell)

        return  sameComplimentaryCoordinate
            && isBeingRemoved
            && hasrowOrColSpan
            && included
      })

      if (mergedCell) {
        return {
          ...cell,
          ...L.pick(mergedCell, ['rowspan', 'colspan']),
          [getSpanKey(rowOrCol)]: getSpan(mergedCell, rowOrCol) - (cell[rowOrCol] - mergedCell[rowOrCol])
        }
      }
    }

    return cell
  })
}

const removeCells = (cells, rowOrCol, index, amount) =>
  L.filter(cells, cell => !willBeDeleted(cell, rowOrCol, index, amount))

const moveCells = (cells, rowOrCol, index, amount) => {
  const result = L.flatMap(cells, cell => {
    if (cell[rowOrCol] < index) {
      return [cell]
    }

    const newrowOrCol = cell[rowOrCol] + amount
    if (newrowOrCol < 0) {
      return []
    }

    const result = { ...cell, [rowOrCol]: cell[rowOrCol] + amount }
    return [result]
  })
  return result
}

export const reallocate = (cells, rowOrCol, index, amount) => {
  let paramCells = reallocateMergedCells(cells, rowOrCol, index, amount)
  if (isADeletion(amount)) {
    paramCells = removeCells(paramCells, rowOrCol, index, amount)
  }
  return moveCells(paramCells, rowOrCol, index, amount)
}
