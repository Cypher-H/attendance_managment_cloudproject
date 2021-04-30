import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../config'
import { connect } from 'react-redux'

function Timetable(props) {

    const [src, setSrc] = useState('')

    useEffect(()=>{
        axios.get(`${baseUrl}/routine`, {
            headers: {
              "x-access-token": props.auth.token,
            },
          })
          .then((res)=>{
            setSrc(res.data.url)
          })
    }, [])

    return (
        <div style={{marginLeft: 260, alignContent: 'center', justifyItems: "center"}}>
            <img src={src} style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: "70%"
            }}/>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Timetable)
