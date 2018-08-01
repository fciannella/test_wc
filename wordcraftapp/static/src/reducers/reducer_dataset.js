import { GET_ALLFILTERS } from '../constants';
export default function(state = [], action) {
    let datasets = [];
    switch (action.type) {
      case GET_ALLFILTERS:
          action.payload.data.datasets.map(dataset => {
              datasets = [...datasets, {"dataset":dataset}];
          });
          return datasets;
      default:
        return state;
      }
}
