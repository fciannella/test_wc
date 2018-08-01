
import { GET_ALLFILTERS } from '../constants';

export default function(state = [], action) {
    let solutions = [];
    switch (action.type) {
      case GET_ALLFILTERS:
          action.payload.data.solutions.map(solution => {
              solutions = [...solutions, {"solution":solution}];
          });
          return solutions;
      default:
        return state;
      }
}
