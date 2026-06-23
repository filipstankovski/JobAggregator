import { S } from '../lib/styles'

export function StateMessage({ icon, text, hint }) {
  return (
    <div style={S.stateBox}>
      <div style={S.stateBig}>{icon}</div>
      <div style={S.stateText}>
        {text}
        {hint && <><br/><small>{hint}</small></>}
      </div>
    </div>
  )
}
