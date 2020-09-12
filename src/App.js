import React, {useEffect, useState} from 'react'
import styles from './App.module.scss'
import axios from 'axios'

const names = ['Shawn N', 'Justin John', 'Wyeth Johann Villanueva',
  'Siddhu Kannan', 'Sriram Bhat', 'Haiming Gao', 'Alonzo Quintero',
  'Shreyas More', 'Robert Yu', 'Arjun Moola', 'Arsh Singh',
  'Duc Huynh', 'Ben Ghaffar', 'Andrew Nguyen', 'John Oh',
  'Sridhar Srinivasan', 'Philemon Ghebrehiwet', 'Marcus Mohammadi',
  'Matthew Tegegne', 'Omar Abdurahman', 'Ali Karim', 'Allen Kim',
  'Jarrett Taylor', 'Shaan Bisht', 'Sydney Streun',
  'Naishur Malhotra', 'Facebook User', 'Steve Chen', 'Vinson Nguyen',
  'Matt Mettler', 'Su Minh Tran']

const appBasePath = "https://row-boat-chat.herokuapp.com/random"

function App() {
  const [questionNum, setQuestionNum] = useState(1)
  const [quote, setQuote] = useState("")
  const [choices, setChoices] = useState([])
  const [numCorrect, setNumCorrect] = useState(0)
  const [answerMode, setAnswerMode] = useState(false)
  useEffect(() => {
    (async () => {
      try {
        const temp = (await axios.get(`${appBasePath}`)).data
        setQuote(temp)
        const tempChoices = getRandom(names.filter((name) => name !== temp.Name), 3)
        setChoices(shuffle([...tempChoices, temp.Name]))
      } catch (e) {
        alert(e)
        setChoices(choices)
      }
    })()
  }, [setChoices, questionNum, setQuote])

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <h1>Who said it?</h1>
        <p><span className={styles.numCorrect}>{numCorrect}</span>/ {questionNum}</p>
        <p className={styles.quote}>{quote.Message}</p>
        {
          <ul>
            {choices.map((name) => {
              if (name === quote.Name)
                return <button className={answerMode ? styles.correct : ""}
                               onClick={() => {
                                 setNumCorrect(numCorrect + 1)
                                 setAnswerMode(true)
                               }}
                               disabled={answerMode}
                >
                  {name}
                </button>
              else
                return <button className={answerMode ? styles.wrong : ""}
                               onClick={() => setAnswerMode(true)}
                               disabled={answerMode}
                >
                  {name}
                </button>
            })}
          </ul>
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
