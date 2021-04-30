import React, {useState, useEffect} from 'react'
import { Paper, Typography, CircularProgress, Box } from '@material-ui/core'
import { connect } from 'react-redux';
import axios from 'axios'
import { baseUrl } from '../../config'

const ImgUpload =({
  onChange,
  src,
})=>{
  return(
    <label for="photo-upload" className="custom-file-upload fas">
      <div className="img-wrap img-upload" >
        <img for="photo-upload" height='100' src={src}/>
      </div>
      <input id="photo-upload" type="file" onChange={onChange}/> 
    </label>
  );
}


const Profile =({
  onSubmit,
  src,
  name,
  status,
})=>{
  return(
   <div className="card">
    <form onSubmit={onSubmit}>
      <h1>Student Dashboard</h1>
      <label className="custom-file-upload fas">
        <div className="img-wrap" >
          <img for="photo-upload" height={100} src={src}/>
        </div>
      </label>
      <div className="name">{name}</div>
      <div className="status">{status}</div>
      <button type="submit" className="edit">Edit Profile </button>
    </form>
   </div>
  );
}
      
const Edit =({
  onSubmit,
  children,
})=>{
  return(
    <div className="card">
      <form onSubmit={onSubmit}>
        <h1>Student Dashboard</h1>
        {children}
        <button type="submit" className="save">Save </button>
      </form>
    </div>
  );
}

function CircularProgressWithLabel(props) {

  const [progress, setProgress] = useState(0)

  useEffect(()=>{
    axios.get(`${baseUrl}/attendance`, {
      headers: {
        'x-access-token': props.auth.token
      }
    })
    .then((res)=>{
      axios.get(`${baseUrl}/uniqueAttendance`, {
        headers: {
          'x-access-token': props.auth.token
        }
      })
      .then((res1)=>{
        let temp = 0
        res1.data.days.forEach((val)=>{
          temp+=res.data.attendance.filter((val1)=>val1.date == val).length
        })
        setProgress((temp/res1.data.days.length)*100)

      })
    })
  }, [])

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          progress,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       file: '',
       imagePreviewUrl: this.props.profile.url,
       name:'',
       status:'',
       active: 'edit'
    };
  }
  photoUpload (e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file);

  }
  
  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(); 
     
        // Update the formData object 
        if (this.state.active === 'edit' & this.state.file !== '') {
          formData.append( 
            "file", 
            this.state.file, 
          );
    
          axios.post(`${baseUrl}/setprofile`, formData,{
            headers: {
              'x-access-token': this.props.auth.token
            }
          })
          .then((res)=>{
            console.log('ok')
          })
        }
        
    let activeP = this.state.active === 'edit' ? 'profile' : 'edit';
    this.setState({
      active: activeP,
    })
  }
  
  render() {
    console.log(this.props.profile)
    const {imagePreviewUrl, 
           name, 
           status, 
           active} = this.state;
    return (
      <Paper style={{marginLeft: 260, padding: 10, paddingRight: 0}}>
      <div >
        {(active === 'edit')  
          ?<Edit onSubmit={(e)=>this.handleSubmit(e)}>
              <ImgUpload onChange={(e)=>this.photoUpload(e)} src={imagePreviewUrl}/>
            </Edit>
          :<Profile onSubmit={(e)=>this.handleSubmit(e)} src={imagePreviewUrl} name={name} status={status}/>}
          <Typography style={{fontWeight: 900, padding: 2}} variant='body1'>Name: <Typography style={{fontWeight: 400}} noWrap={true} variant='inherit'>{this.props.profile.username}</Typography></Typography>
          <Typography style={{fontWeight: 900, padding: 2}} variant='body1'>EnrollmentId: <Typography style={{fontWeight: 400}} noWrap={true} variant='inherit'>{this.props.profile.roll_no}</Typography></Typography>
          <Typography style={{fontWeight: 900, padding: 2}} variant='body1'>Phone Number: <Typography style={{fontWeight: 400}} noWrap={true} variant='inherit'>{this.props.profile.phone_no}</Typography></Typography>
          <Typography style={{fontWeight: 900, padding: 2}} variant='body1'>Email: <Typography style={{fontWeight: 400}} noWrap={true} variant='inherit'>{this.props.profile.email}</Typography></Typography>
      </div>
      <h2>Attendance Progress</h2>
      <CircularProgressWithLabel {...this.props} value={20} />  
      </Paper>
    )
  }
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
    profile: state.profile
  };
};


export default connect(matchStateToProps)(StudentDashboard)