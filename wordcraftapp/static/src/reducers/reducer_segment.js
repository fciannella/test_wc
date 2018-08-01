import { GET_SEGMENT } from '../constants';

export default function(state = [], action) {
    let segments = [];
    switch (action.type) {
      case GET_SEGMENT:
          action.payload.data.segments.map(segment => {
              segments = [...segments, {"segment":segment}];
          });
          return segments;
      default:
        return state;
      }
}
