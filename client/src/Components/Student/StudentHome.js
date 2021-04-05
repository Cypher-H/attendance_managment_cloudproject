import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import StudentAttendance from './StudentAttendance'
import StudentDashboard from './StudentDashboard'
import StudentNav from './StudentNav'
import StudentProfile from './StudentProfile'




function StudentHome(props) {
    return (
        <div>
            <StudentNav />
            This is student home page token expiry {props.auth.exp}
            <Switch>
                <Route exact path="/student"><StudentDashboard /></Route>
                <Route path="/student/profile"><StudentProfile /></Route>
                <Route path="/student/attendance"><StudentAttendance /></Route>
            </Switch>

        </div>
    )
}

const matchStateToProps = (state)=>{
    return {
        auth: state.auth
    }
}

export default connect(matchStateToProps)(StudentHome)
