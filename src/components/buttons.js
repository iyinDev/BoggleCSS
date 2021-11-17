import {useEffect, useRef, useState} from "react";
import RandomGrid from "../services/random-gen";
import findAllSolutions from "../services/boggle-solver";
import {lockBoggleTiles, resetTileColors, showAvailable, unlockAllBoggleTiles} from "../services/grid-services";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection, doc, getDoc, query} from "firebase/firestore";

export function Submit() {
    const ref = useRef()

    useEffect(() => {
        ref.current.disabled = window.$disabled
    }, [window.$disabled])

    const scoreHardMode = () => {
        if (window.$solutions && window.$solutions.includes(window.$word) && window.$word.length >= 5) {

            if (window.$word.length === 5) {
                window.$setScore(score => score + 2)
            } else if (window.$word.length === 6) {
                window.$setScore(score => score + 3)
            } else if (window.$word.length === 7) {
                window.$setScore(score => score + 5)
            } else if (window.$word.length >= 8) {
                window.$setScore(score => score + 11)
            }
            window.$setFoundWords([...window.$foundWords, window.$word])
            window.$setWord("")
            window.$queue = []
            unlockAllBoggleTiles()
            window.$setSelected = ""
            console.log("found")
        }
    }
    const scoreMediumMode = () => {
        if (window.$solutions && window.$solutions.includes(window.$word) && window.$word.length >= 4) {

            if (window.$word.length === 4) {
                window.$setScore(score => score + 1)
            } else if (window.$word.length === 5) {
                window.$setScore(score => score + 2)
            } else if (window.$word.length === 6) {
                window.$setScore(score => score + 3)
            } else if (window.$word.length === 7) {
                window.$setScore(score => score + 5)
            } else if (window.$word.length >= 8) {
                window.$setScore(score => score + 11)
            }
            window.$setFoundWords([...window.$foundWords, window.$word])
            window.$setWord("")
            window.$queue = []
            unlockAllBoggleTiles()
            window.$setSelected = ""
            console.log("found")
        }
    }
    const scoreEasyMode = () => {
        if (window.$solutions && window.$solutions.includes(window.$word) && window.$word.length >= 3) {
            if (window.$word.length <= 4) {
                window.$setScore(score => score + 1)
            } else if (window.$word.length === 5) {
                window.$setScore(score => score + 2)
            } else if (window.$word.length === 6) {
                window.$setScore(score => score + 3)
            } else if (window.$word.length === 7) {
                window.$setScore(score => score + 5)
            } else if (window.$word.length >= 8) {
                window.$setScore(score => score + 11)
            }
            window.$setFoundWords([...window.$foundWords, window.$word])
            window.$setWord("")
            window.$queue = []
            unlockAllBoggleTiles()
            console.log("found")
        }
    }
    const handler = () => {
            if (window.$foundWords.includes(window.$word)) {
                document.getElementById("already-found-modal").style.display = "block"
            } else if (window.$solutions && window.$solutions.includes(window.$word)) {
                if (window.$difficulty === 'easy') {
                    scoreEasyMode()
                } else if (window.$difficulty === 'medium') {
                    scoreMediumMode()
                } else {
                    scoreHardMode()
                }
            } else {
                console.log("not found")
            }
        }

    return (
            <button ref={ref} className={"input-button submit"} onClick={handler}/>
    )
}
export function Backspace() {

    const ref = useRef()

    useEffect(() => {
        ref.current.disabled = window.$disabled
    })

    const handler = () => {
        window.$setWord(window.$word.slice(0, -1))
        window.$queue.pop()
        if (!(window.$queue === [])) {
            showAvailable(window.$queue.at(-1))
            if (window.$queue.at(-1)) {
                document.getElementById(window.$queue.at(-1)).focus()
            }
        } else {
            unlockAllBoggleTiles()
        }
    }

    return (
        <button ref={ref} className={"input-button backspace"} onClick={handler} />
    )
}

const loadNewBoard = () => {
    window.$setDisabled(false)
    let board = RandomGrid(5)
    window.$setGrid(board)
    window.$solutions = findAllSolutions(board)
    window.$setFoundWords([])
    window.$setScore(0)
    unlockAllBoggleTiles()
}

const clearBoard = () => {
    window.$setDisabled(false)
    let board = []
    for (let i = 0; i < 5; i++) {
        let row = []
        for (let j = 0; j < 5; j++) {row.push(" ")}
        board.push(row)
    }
    window.$setGrid(board)
    window.$setFoundWords([])
    window.$setScore(0)
    window.$setDisabled(true)
    window.$timerReset()
}

const startTimer = () => {
    window.$timerStart()
}

const clearFoundWords = () => {
    while (document.getElementById("found-words").firstChild) {
        document.getElementById("found-words").removeChild(document.getElementById("found-words").firstChild)
    }
}

export function NewGame() {
    const ref = useRef()
    window.$newGame = ref

    const handler = () => {
        loadNewBoard()

        window.$queue = []
        window.$foundWords = []
        window.$setPlaying = true
        startTimer()
    }

    return (
        <button
            className={"input-button new-game"}
            ref={ref}
            onClick={handler}/>
    )
 }

export function Settings() {
    const ref = useRef()

    const handler = () => {
        document.getElementById("settings-modal").style.display = "block"
    }

    return (
        <button
            className={"input-button settings"}
            ref={ref}
            onClick={handler}/>
    )
}

export function ChangeDifficulty() {
    const handler = () => {
        if (window.$difficulty === 'easy') {
            window.$setDifficulty('medium')
        } else if (window.$difficulty === 'medium') {
            window.$setDifficulty('hard')
        } else {
            window.$setDifficulty('easy')
        }
        clearBoard()
        window.$queue = []
    }
    return (
        <div className={"settings-state"}>
            <button className={"toggle"} onClick={handler}>CHANGE DIFFICULTY</button>
            <div className={"toggle-state"}>{window.$difficulty.toUpperCase()}</div>
        </div>
    )
}

export function LoadChallenge() {

    const [challenges] = useCollectionData(query(collection(window.$db, "challenges")), {idField: 'id'})
    const [currentChallenge, setCurrentChallenge] = useState("None")

    const handler = async () => {
        let grid = []
        let board = await getDoc(doc(window.$db, "challenges", currentChallenge))
        let data = board.data()

        for (let i in data) grid.push(data[i])
        window.$solutions = findAllSolutions(grid)
        window.$setGrid(grid)
        window.$setFoundWords([])
        window.$setScore(0)

        document.getElementById("settings-modal").style.display = "none"

        window.$setDisabled(false)
        window.$timerStart(window.$gameTime)
    }

    return (
        <div className={"settings-state"}>
            <button className={"toggle"} onClick={handler}>LOAD CHALLENGE</button>
            <div className={"dropdown toggle-state"}>
                <div className={"dropbtn"}>{currentChallenge}</div>
                <div className={"dropdown-content"}>
                    <div className={"dropdown-item"} onClick={() => setCurrentChallenge("NONE")}>NONE</div>
                    <div>{challenges && challenges.map(challenge => <div className={"dropdown-item"}
                                                                         onClick={() => setCurrentChallenge(challenge.id.toUpperCase())}>{challenge.id}</div>)}</div>
                </div>
            </div>

        </div>
    )
}

export function SignInWithGoogle() {
    const auth = getAuth()

    const signInHandler = (result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // // The signed-in user info.
        // const user = result.user;
        console.log(result.user.email + " just signed in!")
    }

    const errorHandler = (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        console.log(email + ": " + errorMessage)
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider).then(result => signInHandler(result)).catch(error => errorHandler(error))
    }

    return (
        <div className={"settings-state"}>
            <button className={"toggle"} onClick={signInWithGoogle}>Sign In with Google</button>
            <div className={"toggle-state login-status"}>{window.$user? "Signed In": "Not Signed In"}</div>
        </div>
    )
}