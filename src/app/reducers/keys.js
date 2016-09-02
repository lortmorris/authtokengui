
const Key = (state, action)=>{
    switch(action.type){
        case 'ADD_KEY':
            return {
                "userid": action.userid,
                "apikey": action.apikey,
                "secret": action.secret,
                "ratelimit": action.ratelimit,
                "allow": action.allow || [],
                "deny": action.deny || []
            }
            break;

        default:
            return state;
    }
}


const keys = (state=[], action)=>{
    switch(action.type){

        case 'ADD_KEY':
            return [...state, Key({}, action)];
            break;

        case 'CHANGE_API':
            return state.map( (u)=> Key(u, action));
            break;
        default:
            return state;
    }
}

const KeysFilter=(state='SHOW_ALL', action)=>{
    switch(action.type){
        case 'USER_ID':
            return 'USER_ID';
            break;

        default:
            return state;
    }
}



export {Keys, KeysFilter};