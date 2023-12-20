import React from 'react'
import ReactDOM from 'react-dom/client'

import { format, isBefore } from 'date-fns'
import { createClient } from '@supabase/supabase-js'

import SVG from './svg'

import './index.css'

const App = () => {
  const supabaseUrl = 'https://sjtesditjjocngtaptvo.supabase.co'
  const supabaseKey = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdGVzZGl0ampvY25ndGFwdHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5OTY3OTIsImV4cCI6MjAxODU3Mjc5Mn0',
    'HMbWtFRlt2l5hULBK3i9n_fTWdofrJxlkVnwa2s79Q0',
  ].join('.')
  const supabase = createClient(supabaseUrl, supabaseKey)
  const today = format(new Date(), 'yyyyMMdd')
  const template = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'ATTENDEE;CN="Jose Gomes";CUTYPE=INDIVIDUAL;EMAIL="jbonigomes@yahoo.com.br";PARTSTAT=NEEDS-ACTION',
    'ATTENDEE;CN="Vanessa Tabarin";CUTYPE=INDIVIDUAL;EMAIL="vanessa.tabarin@gmail.com";PARTSTAT=ACCEPTED',
    'SUMMARY:Vale Nite',
    'SEQUENCE:0',
    'TRANSP:TRANSPARENT',
    `UID:${Date.now()}@jbonigomes.com`,
    `DTSTART;TZID=Europe/London:${today}T170000`,
    `DTSTART;TZID=Europe/London:${today}T220000`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('%0A')

  const [loading, setLoading] = React.useState(true)
  const [disabled, setDisabled] = React.useState(true)

  const onClick = (e) => {
    if (disabled) {
      e.stopPropagation()
    } else {
      setLoading(true)

      supabase
        .from('tickets')
        .update({ expired: true })
        .eq('id', +(new URLSearchParams(window.location.search)).get('id'))
        .then(() => {
          setDisabled(true)
          setLoading(false)
        })
    }
  }

  React.useEffect(() => {
    if (isBefore(new Date(), new Date(2025, 1, 1))) {
      supabase
          .from('tickets')
          .select('expired')
          .eq('id', +(new URLSearchParams(window.location.search)).get('id'))
          .single()
          .then(({ data }) => {
            setLoading(false)
            setDisabled(!(data && !data.expired))
          })
    } else {
      setLoading(false)
      setDisabled(true)
    }
  }, [])

  return (
    <>
      {loading ? (
        <section>
          <span />
        </section>
      ) : (
        <>
          <h1>Vale Nite</h1>
          <SVG />
          <a
            download
            target="_blank"
            rel="noopener noreferrer"
            href={`data:text/calendar;charset=utf8,${template}`}
          >
            <button disabled={disabled} onClick={onClick}>
              {disabled ? 'Expired' : 'Add to Calendar'}
            </button>
          </a>
        </>
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
