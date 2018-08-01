import React, { Component } from 'react';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {checkuser, ssoStatus, modifySignInStatus, modifyCampaignHomeStatus} from "../actions/index";


class App extends Component {

  componentWillReceiveProps(nextprops){
    console.log("i an in app",nextprops);
    if(nextprops.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }
    if(nextprops.campaignHomeStatus === "goToCampaignList"){
      this.props.history.push("/campaignlist");
    }
  }

  componentWillMount(){
    this.props.ssoStatus(result => {
      console.log("SSO STATUS IN componentWillMount", result.data);

      if(result.data.sso === 1){
      if(this.props.signInStatus !=="loggedin"){
        console.log("Not Logged IN");
        console.log("SSO STATUS IN email", result.data.email);
        this.props.modifySignInStatus({signInStatus:'loggedin', user: result.data.email});
        this.props.checkuser({user:result.data.email}).then(res => {
          if(result.data.message === "false"){
            this.props.history.push("/signup");
          }else{
            this.props.modifyCampaignHomeStatus({campaignHome:"inCampaignHome"});
            this.props.history.push("/campaignlist");
          }
        })
      }
      }
      else{
        if(this.props.signInStatus !=="loggedin"){
            this.props.history.push('/signin');
        }
      }
    });
    window.scrollTo(0, 0);
  }



  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    signInStatus : state.signInStatus,
    selections : state.globalSelection,
    campaignHomeStatus : state.campaignHomeStatus,

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({checkuser:checkuser, ssoStatus:ssoStatus,
                             modifySignInStatus:modifySignInStatus, modifyCampaignHomeStatus:modifyCampaignHomeStatus}, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(App);
