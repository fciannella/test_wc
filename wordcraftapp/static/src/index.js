import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactDOM from 'react-dom';
import ReduxPromise from "redux-promise";
import App from './components/App';
import AppHome from './components/applicationHome';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CampaignHome from './components/CampaignHome';
import HelpManual from './components/HelpManual';
import CampaignList from './components/campaignlist';
import Review from './components/Review';
import Editor from './components/Editor';
import Notifications from './components/notifications';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);


ReactDOM.render(

  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>

          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/campaignlist" component={CampaignList} />
          <Route path="/CampaignHome" component={CampaignHome} />
          <Route path="/helpmanual" component={HelpManual} />
          <Route path="/applicationHome" component={AppHome} />
          <Route path="/review" component={Review} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/" component={App} />

        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
