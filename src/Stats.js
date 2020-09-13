import React from 'react'
import {names} from "./App"
import Plot from 'react-plotly.js'


export default function Stats(props) {
  const percents = {}
  for (const name of names) {
    if (props.answered[name] !== 0)
      percents[name] = props.correct[name] / props.answered[name]
  }
  console.log(percents, props)
  return (
    <>
      <button onClick={props.closeStats}>Back</button>
      {
        <Plot
          data={[
            {
              x: Object.keys(percents),
              y: Object.values(percents),
              type: 'bar',
              marker: {
                line: {
                  width: '2.5',
                }
              },
            },
          ]}
          layout={{title: 'Percent Correct', width: "1024", height: "800"}}
          config={{responsive: true}}
        />
      }
    </>
  )

}
