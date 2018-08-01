import { GET_ALLFILTERS } from '../constants';
export default function(state = [], action) {
    let channels = [];
    switch (action.type) {
      case GET_ALLFILTERS:
          action.payload.data.channels.map(channel => {
              channels = [...channels, {"channel":channel}];
          });
          return channels;
      default:
        return state;
      }
}
