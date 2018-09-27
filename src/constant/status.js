import _ from 'lodash'

const status = [
    "online",
    "busy",
    "away",
    "offline"
]

const color = [
    "#2de0a5",
    "#f5455c",
    "#ffd21f",
    "#cbced1"
]

export default _.zipObject(status, color)