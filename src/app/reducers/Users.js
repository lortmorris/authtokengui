

const User = (state, action)=>{
    switch(action.type){
        case 'ADD_USER':
            return {
                "email": action.email,
                "fname": action.fname,
                "lname": action.lname,
                "city":  action.city,
                "phone": action.phone || ""
            };
            break;

        default:
            return state;
    }//end switch
}

const Users = (state=[], action)=>{
    switch(action.type){
        case 'ADD_USER':
            return [...state, User({}, action)];
        break;

        default:
            return state;
    }
}

const UsersFilter = (state='SHOW_ALL', action)=>{
    switch(action.type){
        case 'CITY':
            return 'CITY'
            break;

        default:
            return state;
    }
}


export {Users, UsersFilter};