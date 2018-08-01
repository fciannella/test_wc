import { USER_SETTINGS } from '../constants';

export default function(state = {email:[],role:[]}, action) {
    let settings = {email:[],role:[]};
    switch (action.type) {
      case USER_SETTINGS:
          settings =  action.payload.data;
          return settings;
      default:
        return state;
      }
}
