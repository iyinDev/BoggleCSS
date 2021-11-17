import {useEffect, useRef, useState} from "react";
import {showAvailable} from "../services/grid-services";

let tiles = []
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        let id = j.toString() + i.toString()
    }
}

export function Boggle(props) {

    let defaultGrid = []
    for (let i = 0; i < 5; i++) {
        let row = []
        for (let j = 0; j < 5; j++) row.push("")
        defaultGrid.push(row)
    }

    const [ grid, setGrid ] = useState(defaultGrid)
    window.$setGrid = setGrid

    let defaultTiles = {}
    let tileIDs = []
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let id = j.toString() + i.toString()
            defaultTiles[id] = grid[j][i]
            tileIDs.push(id)
        }
    }
    const [tiles, setTiles ] = useState(defaultTiles)
    window.$tiles = tiles
    window.$setTiles = setTiles

    useEffect(() => {
        let newTiles = {}
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let id = j.toString() + i.toString()
                newTiles[id] = grid[i][j]
            }
        }
        setTiles(newTiles)
    }, [grid])

    return (
        <div className={"boggle"}>
            {tileIDs && tileIDs.map(tile => <Tile id={tile} value={window.$tiles[tile]}/>)}
        </div>
    )
}

export function Tile(props) {
    const ref = useRef()

    const [value, setValue] = useState("")

    useEffect(() => {
        ref.current.disabled = window.$disabled
    }, [window.$disabled])

    useEffect(() => {
        setValue(window.$tiles[props.id])
    }, [window.$tiles]);

    const addToWord = () => {
        window.$queue.push(props.id)
        window.$setWord(window.$word + (value? value : ""))
    }

    const handler = () => {
        addToWord()
        showAvailable(ref.current.id)
        ref.current.disabled = true
    }

    return (
        <button ref={ref} className={"tile"} id={props.id} onClick={handler} tabindex="0">
            <span>{value}</span>
        </button>
    )
}