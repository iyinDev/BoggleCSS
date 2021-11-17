export const isSafe = (x, y, id) => {
    let elem = document.getElementById(id)
    if (elem === null) {
        return false
    }
    return ((0 <= x  && x < 5) && (0 <= y && x < 5))
}

export const genID = (x, y) => {
    return y.toString() + x.toString()
}

export const getTile = (x, y) => {
    let id = y.toString() + x.toString()
    return id
}

export const lockBoggleTiles = () => {
    for (let i in window.$tiles) {
        document.getElementById(i).disabled = true
    }
}

export const unlockAllBoggleTiles = () => {
    for (let i in window.$tiles) {
        document.getElementById(i).disabled = false
    }
}

export const clearAllBoggleTiles = () => {
    for (let i in window.$tiles) {
        window.$tiles[i] = ""
    }
}

export const unlockSelectBoggleTiles = (tiles) => {
    resetTileColors()
    for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i]
        document.getElementById(tile).disabled = false
    }
}

export  const findAvailableMoves = (id = null) => {
    let lastMove = window.$queue.pop()
    window.$queue.push(lastMove)

    let x, y

    x = parseInt(id[1])
    y = parseInt(id[0])

    lockBoggleTiles()
    return {
        up: isSafe(x, y - 1, genID(x, y - 1)) ?  getTile(x, y - 1) : null,
        down: isSafe(x, y + 1, genID(x, y + 1)) ?  getTile(x, y + 1) : null,
        left: isSafe(x - 1, y, genID(x - 1, y)) ?  getTile(x - 1, y) : null,
        right: isSafe(x + 1, y, genID(x + 1, y)) ?  getTile(x + 1, y) : null,
        upLeft: isSafe(x - 1, y - 1, genID(x - 1,  y - 1)) ?  getTile(x - 1, y - 1) : null,
        upRight: isSafe(x + 1, y - 1, genID(x + 1,  y - 1)) ?  getTile(x + 1, y - 1) : null,
        downLeft: isSafe(x - 1, y + 1, genID(x - 1,  y + 1)) ?  getTile(x - 1, y + 1) : null,
        downRight: isSafe(x + 1, x + 1, genID(x + 1,  y + 1)) ?  getTile(x + 1, y + 1): null,
    }
}

export const removeEmpty = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export const showAvailable = (tile) => {
    let moves, exempt

    if (!(tile)) {
        unlockAllBoggleTiles()
        return null
    }

    moves = findAvailableMoves(tile)
    if (moves) {
        moves = removeEmpty(moves)
        exempt = []
        for (let move in moves) {
            if (!(window.$queue.includes(moves[move]))) {
                exempt.push(moves[move])
            }
        }
        lockBoggleTiles()
        unlockSelectBoggleTiles(exempt)
    }
}

export const resetTileColors = () => {
    for (let i in window.$tiles) {
        let tile = document.getElementById(i)
        tile.style.background = "var(--pentary)"
    }
}