import { SIGN_IN_STATUS } from '../constants';

export default function(state = "", action) {
    let signInStatus = "";
    switch (action.type) {
      case SIGN_IN_STATUS:
          signInStatus = action.payload.signInStatus;
          return signInStatus;
      default:
        return state;
      }
}
