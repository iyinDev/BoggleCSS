import './public/App.css';
import {Boggle} from "./components/boggle";
import {Timer} from "./components/timer";
import {useEffect, useState} from "react";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore, collection} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import {Backspace, Settings, NewGame, SignInWithGoogle, Submit} from "./components/buttons";
import {WordBuffer} from "./components/word-buffer";
import {Leaderboard, Scoreboard} from "./components/boards";
import {useAuthState} from "react-firebase-hooks/auth";
import {resetTileColors} from "./services/grid-services";
import {AlreadyPlayedModal, FinalScoreModal, LoginModal, SettingsModal} from "./components/modals";

const config = require("./utils/firebase-config.json")
const app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
})
const db = getFirestore(app)
const scoreDB = collection(db, "score-records")
window.$db = db
window.$scoreDB = scoreDB

window.$modals = ['already-found-modal', 'final-score-modal', 'settings-modal']

function Main() {
    return (
        <div className={"box container"}>
            <Timer/>
            <WordBuffer/>
            <Scoreboard/>
            <Boggle/>
            <div className={"box buttons"}>
                <Submit/>
                <Backspace/>
                <NewGame/>
                <Settings/>
            </div>
            <Leaderboard/>
        </div>
    )
}

function App() {
    const [difficulty, setDifficulty] = useState("easy")
    const [foundWords, setFoundWords] = useState([])
    const [score, setScore] = useState(0)
    const [disabled, setDisabled] = useState(true)
    const [selected, setSelected] = useState("")
    const [gameTime, setGameTime] = useState(5 * 60 * 1000)

    const auth = getAuth()
    const [user] = useAuthState(auth)

    window.$score = score
    window.$foundWords = foundWords
    window.$queue = []
    window.$user = user
    window.$disabled = disabled
    window.$selected = selected
    window.$difficulty = difficulty
    window.$gameTime = gameTime

    window.$setDisabled = setDisabled
    window.$setScore = setScore
    window.$setFoundWords = setFoundWords
    window.$setSelected = setSelected
    window.$setDifficulty = setDifficulty

    useEffect(() => {
        if (selected) {
            resetTileColors()
            let curr = document.getElementById(selected)
            curr.style.background = "red"
            curr.disabled = false
        }
    }, [selected])

    return (
        <div className="App">
            <FinalScoreModal/>
            <AlreadyPlayedModal/>
            <SettingsModal/>
            <Main/>
        </div>
    )
}

export default App;
