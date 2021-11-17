import {useEffect, useRef, useState} from "react";

export function WordBuffer() {
    const ref = useRef()

    const [word, setWord] = useState("")
    window.$word = word
    window.$setWord = setWord

    return (
        <div className={"box word-buffer"}>
            <span className={"buffer-text"}>{word}</span>
        </div>
    )
}