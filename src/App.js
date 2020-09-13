import React, {useEffect, useState} from 'react'
import styles from './App.module.scss'
import axios from 'axios'
import Stats from "./Stats"

export const names = ['Shawn N', 'Justin John', 'Wyeth Johann Villanueva',
  'Siddhu Kannan', 'Sriram Bhat', 'Haiming Gao', 'Alonzo Quintero',
  'Shreyas More', 'Robert Yu', 'Arjun Moola', 'Arsh Singh',
  'Duc Huynh', 'Ben Ghaffar', 'Andrew Nguyen', 'John Oh',
  'Sridhar Srinivasan', 'Philemon Ghebrehiwet', 'Marcus Mohammadi',
  'Matthew Tegegne', 'Omar Abdurahman', 'Ali Karim', 'Allen Kim',
  'Jarrett Taylor', 'Shaan Bisht', 'Sydney Streun',
  'Naishur Malhotra', 'Facebook User', 'Steve Chen', 'Vinson Nguyen',
  'Matt Mettler', 'Su Minh Tran']


const nameStats = {}
for (const name of names) {
  nameStats[name] = 0
}
const nameStatsCorrect = {}
for (const name of names) {
  nameStatsCorrect[name] = 0
}

export const addStats = (name, correct) => {
  nameStats[name]++
  if (correct)
    nameStatsCorrect[name]++
}

const appBasePath = "https://row-boat-chat.herokuapp.com/random"

function App() {
  const [questionNum, setQuestionNum] = useState(1)
  const [quote, setQuote] = useState("")
  const [choices, setChoices] = useState([])
  const [numCorrect, setNumCorrect] = useState(0)
  const [answerMode, setAnswerMode] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    (async () => {
      try {
        const temp = (await axios.get(`${appBasePath}`)).data
        setQuote(temp)
        const tempChoices = getRandom(names.filter((name) => name !== temp.Name), 3)
        setChoices(shuffle([...tempChoices, temp.Name]))
        nameStats[temp.Name]++
        setLoading(false)
      } catch (e) {
        alert(e)
        setChoices(choices)
      }
    })()
    setLoading(true)
  }, [setChoices, questionNum, setQuote])

  return (
    <div className={styles.App}>
      {
        showStats ?
          <div className={styles.container}>
            <Stats answered={nameStats} correct={nameStatsCorrect}
                   closeStats={() => setShowStats(false)}/>
          </div>
          :
          <div className={styles.container}>
            <h1>Who said it?</h1>
            <button onClick={() => setShowStats(true)}>Show stats</button>
            <p><span className={styles.numCorrect}>{numCorrect}</span>/ {questionNum}
            </p>
            {
              !loading &&
              <>
                <p className={styles.quote}>{quote.Message}</p>
                <ul>
                  {choices.map((name) => {
                    if (name === quote.Name)
                      return <button className={answerMode ? styles.correct : ""}
                                     onClick={() => {
                                       setNumCorrect(numCorrect + 1)
                                       nameStatsCorrect[name]++
                                       setAnswerMode(true)
                                     }}
                                     disabled={answerMode}
                      >
                        {name}
                      </button>
                    else
                      return <button className={answerMode ? styles.wrong : ""}
                                     onClick={(e) => {
                                       setAnswerMode(true)
                                       e.target.style = "background: #b55c5c"
                                     }}
                                     disabled={answerMode}
                      >
                        {name}
                      </button>
                  })}
                </ul>
              </>
            }
            {
              answerMode && <div>
                <button onClick={() => {
                  setAnswerMode(false)
                  setQuestionNum(questionNum + 1)
                }}>Next
                </button>
              </div>
            }
          </div>
      }
    </div>
  )
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function getRandom(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available")
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

export default App
