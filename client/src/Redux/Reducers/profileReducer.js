import { Get_Profile, Remove_Profile } from "../Actions/actionsName"

const initialState = {
    username: "",
    roll_no: "",
    email: "",
    phone_no: "", 
    subjects: [],
    url: ''
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case Get_Profile: {
            return {
                ...initialState,
                username: action.username,
                roll_no: action.roll_no,
                email: action.email,
                phone_no: action.phone_no,
                subjects: action.subjects,
                url: action.url
            }
        }
        case Remove_Profile: {
            return {
                ...initialState
            }
        }
        default: {
            return state;
          }
    }
}