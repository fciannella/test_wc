import { GET_ALLFILTERS } from '../constants';
export default function(state = [], action) {
    let motions = [];
    switch (action.type) {
      case GET_ALLFILTERS:
          action.payload.data.motions.map(motion => {
              motions = [...motions, {"motion":motion}];
          });
          return motions;
      default:
        return state;
      }
}
