import { REVIEW_HOME } from '../constants';

export default function(state = "", action) {
    let reviewHome = "false";
    switch (action.type) {
      case REVIEW_HOME:
          reviewHome = action.payload.reviewHome;
          return reviewHome;
      default:
        return state;
      }
}
