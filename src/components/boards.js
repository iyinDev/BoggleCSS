import {useEffect, useRef, useState} from "react";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {collection, limit, orderBy, query} from "firebase/firestore";

export function Scoreboard() {
    const ref = useRef()

    useEffect(() => {
        if (!window.$disabled) {
            ref.current.innerHTML = "CURRENT SCORE: " + window.$score
        } else {
            ref.current.innerHTML = ""
        }
    }, [window.$disabled, window.$score])

    return (
        <div className={"box scoreboard"}>
            <div ref={ref} className={"scoreboard-title"}/>
            <ul className={"found-words"}>
                {window.$foundWords && window.$foundWords.map(word => <li>{word}</li>)}
            </ul>
        </div>
    )
}

export function Leaderboard() {
    const q = query(collection(window.$scoreDB, window.$difficulty, "leaderboard"),orderBy('score', 'desc'), limit(5))
    const [leaders] = useCollectionData(q, {idField: 'id'})

    console.log(leaders)
    return (
        <div className={"box leaderboard"}>
            <div className={"leaderboard-title"}>LEADERBOARD - {window.$difficulty.toUpperCase()}</div>
            {/*<ul className={"leaders"}>*/}
            {/*    {leaders && leaders.map(leader => <li className={"leader"}>{leader.user.padEnd(20)} - {leader.score}</li>)}*/}
            {/*</ul>*/}
            <table className={"leaders"}>
                <tr>
                    <td>{leaders? (leaders[0]? " 1. " + leaders[0].user.toUpperCase() : " 1.") : " 1."}</td>
                    <td>{leaders? (leaders[0]? leaders[0].score : " ") : " "}</td>
                </tr>
                <tr>
                    <td>{leaders? (leaders[1]? " 2. " +leaders[1].user.toUpperCase() : " 2.") : " 2."}</td>
                    <td>{leaders? (leaders[1]? leaders[1].score : " ") : " "}</td>
                </tr>
                <tr>
                    <td>{leaders? (leaders[2]? " 3. " +leaders[2].user.toUpperCase() : " 3.") : " 3."}</td>
                    <td>{leaders? (leaders[2]? leaders[2].score : " ") : " "}</td>
                </tr>
                <tr>
                    <td>{leaders? (leaders[3]? " 4. " +leaders[3].user.toUpperCase() : " 4.") : " 4."}</td>
                    <td>{leaders? (leaders[3]? leaders[3].score : " ") : " "}</td>
                </tr>
                <tr>
                    <td>{leaders? (leaders[4]? " 5. " +leaders[4].user.toUpperCase() : " 5.") : " 5."}</td>
                    <td>{leaders? (leaders[4]? leaders[4].score : " ") : " "}</td>
                </tr>
            </table>
        </div>
    )
}