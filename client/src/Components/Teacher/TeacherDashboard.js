import React from 'react'
import { connect } from 'react-redux';

function TeacherDashboard() {
    return (
        <div>
            hello world
        </div>
    )
}

const matchStateToProps = (state) => {
    return {
      auth: state.auth,
    };
  };

export default connect(matchStateToProps)(TeacherDashboard)
