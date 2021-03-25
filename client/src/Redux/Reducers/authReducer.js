import { Log_Out } from '../Actions/actionsName'
import { Login_Failed, Logging_In, Login_Success} from '../Actions/actionsName'


const initialState = {
    auth: false,
    token: null,
    status: '',
    loading: false,
    uid: null,
    role: '',
    exp: null
} 

export const authReducer =  (state = initialState, action) =>{
    switch (action.type) {
        case Login_Failed:{
            return{
                ...initialState,
                status: action.status,
                loading: false
            }
        }
        case Logging_In:{
            return{
                ...initialState,
                loading: true
            }
        }
        case Login_Success: {
            return{
                loading: false,
                auth: true,
                token: action.token,
                status: action.status,
                uid: action.uid,
                role: action.role,
                exp: action.exp
            }
        }
        case Log_Out: {
            return initialState
        }
        default:{
            return state
        }
    }
}