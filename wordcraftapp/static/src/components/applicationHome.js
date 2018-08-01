import React, { Component } from 'react';
import Header from './header';
import MailContent from './MailContentView';
import PersonasRadioCheck from './PersonasRadioCheck';
import TelemetryCheckBox from './TelemetryCheckBox';
import { connect } from "react-redux";
import {checkuser, ssoStatus, modifySignInStatus, modifyCampaignHomeStatus} from "../actions/index";
import { bindActionCreators } from "redux";
import SelectionPreview from './SelectionPreview';

class AppHome extends Component {

  componentWillReceiveProps(nextprops){
    console.log("i came in applicationHome");
    if(nextprops.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }
    if(nextprops.campaignHomeStatus === "goToCampaignList"){
      this.props.history.push("/campaignlist");
    }
    if(nextprops.campaignHomeStatus === "goToNotificationsPage"){
      this.props.history.push("/notifications");
    }
  }

  componentWillMount(){
    this.props.modifyCampaignHomeStatus({campaignHome:"inAppHome"});
    if(this.props.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }
    if(this.props.campaignHomeStatus === "goToCampaignList"){
      this.props.history.push("/campaignlist");
    }
    window.scrollTo(0, 0);
  }
  /*  CUrrent Campaign name */
  currentCampaignName(){
    return this.props.campaigns.map(campaign => {
        return (
          <span style={{"fontWeight": "bold", "color": "#0098dc", "textTransform": "uppercase"}}>{campaign.campaign}</span>
        )});
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container-fluid">

            <div className="row">

              <div className="setupContainer">
                  <div className="container-fluid padding-top winSetup" style={{"max-width":"95%"}}>
                    <div id="home" className="tab-pane fade in active">
                    <div className="row headingTop">
                      <div className="col-xs-12">
                        <span>{this.currentCampaignName()}</span>
                        <span className="desc">{this.props.selections.description}</span>
                      </div>
                    </div>
                    <div className="col-xs-12 clearAll">
                      <div className="col-sm-6 noPaddLeft">
                        <PersonasRadioCheck />
                      </div>

                      <div className="col-sm-6 noPaddRight">
                          <TelemetryCheckBox />
                      </div>
                    </div>
                      <div className="clearfix"></div>
                      <SelectionPreview />
                      <div>
                        <MailContent />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
        </div>

      </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    signInStatus : state.signInStatus,
    selections : state.globalSelection,
    campaigns: state.campaigns,
    campaignHomeStatus : state.campaignHomeStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({checkuser : checkuser, ssoStatus : ssoStatus,
                             modifySignInStatus : modifySignInStatus, modifyCampaignHomeStatus : modifyCampaignHomeStatus}, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(AppHome);
