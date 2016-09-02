import {combineReducers} from 'Redux';
import {createStore} from 'Redux';



import {Keys, KeysFilter} from './keys';
import {Users, UsersFilter} from './users';


const Application = createStore(combinedReduces({
    Keys, KeysFilter, Users, UsersFilter
}));