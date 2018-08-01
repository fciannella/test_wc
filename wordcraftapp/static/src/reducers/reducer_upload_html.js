import { UPLOAD_HTML_TEMP, RESET_HTML_TEMP } from '../constants';

export default function(state = {htmlTemplate:[]}, action) {
    let htmlTemplate = {htmlTemplate:[]};

    switch (action.type) {
      case UPLOAD_HTML_TEMP:
          console.log("Hello I am here", action.payload.data);
          htmlTemplate = action.payload.data;
          return htmlTemplate;
      case RESET_HTML_TEMP:
          htmlTemplate = {htmlTemplate:[]};
          return htmlTemplate;

      default:
        return state;
      }
}
