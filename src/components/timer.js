import React, { useEffect, useRef } from 'react';

import useCountDown from 'react-countdown-hook';
import {addDoc, query, collection, doc, setDoc} from 'firebase/firestore'
import {clearAllBoggleTiles} from "../services/grid-services";

function format(time) {
    let hrs = ~~(time / 3600)
    let mins = ~~((time % 3600) / 60)
    let secs = ~~time % 60

    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

export function Timer() {
    let initialTime = window.$gameTime
    let interval = 1000

    const ref = useRef(null)
    window.$timer = ref

    const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);
    window.$timerStart = start
    window.$timerPause = pause
    window.$timerResume = resume
    window.$timerReset = reset

    useEffect(() => {
        if ((timeLeft / 1000) === 0 && !window.$disabled) {
            if (window.$user) {
                let scoreData = {
                    score: window.$score,
                    user: window.$user.displayName
                }
                const leaderboard = collection(window.$scoreDB, window.$difficulty, "leaderboard")
                addDoc(leaderboard, scoreData)
                window.$setDisabled(true)
                window.$setWord("")
                document.getElementById("final-score-modal").style.display = "block"
            } else {
                console.log("User is not signed in")
                window.$setDisabled(true)
                window.$setWord("")
                document.getElementById("final-score-modal").style.display = "block"
            }
        }
    }, [timeLeft])

    return (
        <div
            id={"timer"}
            className={"card timer"}
            ref={ref}>{format(timeLeft / 1000)}</div>
    )
}