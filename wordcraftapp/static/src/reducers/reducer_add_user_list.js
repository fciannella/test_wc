import { ADD_USER_LIST } from '../constants';

export default function(state = {users:[]}, action) {
    let users = {users:[]};
    switch (action.type) {
      case ADD_USER_LIST:
          users =  action.payload.data;
          return users;
      default:
        return state;
      }
}
