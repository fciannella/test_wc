import { GET_ALLFILTERS } from '../constants';

export default function(state = [], action) {
      let features = [];
      switch (action.type) {
        case GET_ALLFILTERS:
            action.payload.data.features.map(feature => {
              features = [...features, {"feature":feature}];
            });
            return features;
        default:
            return state;
        }
}
