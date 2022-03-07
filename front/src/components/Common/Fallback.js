import React from 'react'
import { CircularProgress } from '@material-ui/core'

const Fallback = () => {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", zIndex: 999999 }}>
      <CircularProgress />
    </div>
  )
}
export default Fallback