// export default function(){
//   return(
//     [{user:'admin1',language:'English',date:'25 Jan 2018 6:15PM IST',comment:'New changes 1'},
//      {user:'admin2',language:'English',date:'25 Jan 2018 6:15PM IST',comment:'New changes 1'}
//     ]
//   )
// }

import { GET_VERSION_DATA } from '../constants';
export default function(state ={data:[],nrow:0,count:0} , action) {
    let versions = {data:[],nrow:0,count:0};
    switch (action.type) {
      case GET_VERSION_DATA:
          console.log("Version data in reducer", action.payload.data);
          versions = action.payload.data;
          return versions;
      default:
        return state;
      }
}
