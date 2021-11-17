import {useEffect, useRef, useState} from "react";
import {ChangeDifficulty, LoadChallenge, SignInWithGoogle} from "./buttons";
import {Leaderboard} from "./boards";

// export function ModalContainer() {
//     return (
//         <div id={"modal-container"} className={"modal-container"}>
//             <Modal/>
//         </div>
//     )
// }

const closeModal = (id) => {
    document.getElementById(id).style.display = "none"
}

export function SettingsModal() {
    return (
        <div id={"settings-modal"} className={"modal"}>
            <div className="modal-content settings-modal">
                <div className="modal-header">
                    <span onClick={() => closeModal("settings-modal")} className="close">&times;</span>
                    <h2>SETTINGS</h2>
                </div>
                <div className="modal-body">
                    <div className={"settings-buttons"}>
                        <SignInWithGoogle/>
                        <ChangeDifficulty/>
                        <LoadChallenge/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AlreadyPlayedModal() {
    return (
        <div id={"already-found-modal"} className={"modal"}>
            <div className="modal-content">
                <div className="modal-header">
                    <span onClick={() => closeModal("already-found-modal")} className="close">&times;</span>
                    <h2>ALERT!</h2>
                </div>
                <div className="modal-body">
                    <p>You already played that word!</p>
                </div>
            </div>
        </div>
    )
}

export function FinalScoreModal() {

    return(
        <div id={"final-score-modal"} className={"modal"}>
            <div className="modal-content">
                <div className="modal-header">
                    <span onClick={() => closeModal("final-score-modal")} className="close">&times;</span>
                    <h2>FINAL SCORE: {window.$score}</h2>
                </div>
                <div className="results-table">
                    <div className={"results-row"}>
                        <div className={"box results-cell"}>YOUR SOLUTIONS</div>
                        <div className={"box results-cell"}>
                            <ul className={"found-words-res"}>
                                {window.$foundWords && window.$foundWords.map(word => <li>{word}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className={"results-row"}>
                        <div className={"box results-cell"}>ALL SOLUTIONS</div>
                        <div className={"box results-cell"}>
                            <ul className={"found-words-res"}>
                                {window.$solutions && window.$solutions.map(word => <li>{word}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

