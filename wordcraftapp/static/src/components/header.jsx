import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getNotificationData, modifySignInStatus, modifyCampaignHomeStatus,modifyIndex,modifyCampaign,
         modifyReviewHomeStatus,getReviewContent,exportedInfo, logout } from '../actions/index';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ExportedNarrative from './ExportedNarrative';

class Header extends Component{
  constructor(props){
    super(props);
      this.state={

      }
  }
  signout() {
    this.props.modifySignInStatus({signInStatus:""});
    this.props.logout();
  }

  componentWillMount(){
    if(this.props.signInStatus === "loggedin"){
      //this.props.getNotificationData(this.props.selections);
    }
  }

  campaignHome(){
    this.props.modifyCampaignHomeStatus({campaignHome:"goToCampaignList"});
  }
  exportedInfoPage(){

    this.props.modifyIndex({index:1});
    this.props.exportedInfo(this.props.selections);

    let listId = 'pagger_1';
    var removeActive = document.getElementsByClassName("pagger");
    for (let k=0; k<removeActive.length; k++)
    {
        removeActive[k].classList.remove("activePage");
    }
    if(document.getElementById(listId)){
    document.getElementById(listId).classList.add('activePage');
    }
    document.getElementById('exportedModal').classList.add('activeModel');
  }

  getFiveNotifications(){
    console.log("i came in five");
    this.props.modifyIndex({index:0});
    this.props.getNotificationData(this.props.selections);
  }

  getNotificationData(){
    console.log("i came in ten");
    this.props.modifyIndex({index:1});
    this.props.getNotificationData(this.props.selections);
    this.props.modifyCampaignHomeStatus({campaignHome:"goToNotificationsPage"});
  }

  goToReviewPage(selection){
    console.log(selection.campaign);
    if(this.props.selections.campaign.length <= 0){
    this.props.modifyCampaign({campaign:selection.campaign});
    }
    this.props.getReviewContent({user:this.props.selections.user,campaign:[selection.campaign],profile:[selection.profile]});
    this.props.modifyReviewHomeStatus({reviewHome:"goToReviewPage"});
    this.props.modifyCampaignHomeStatus({campaignHome:"goToReviewPage"});
  }

  renderNotification(){
    return this.props.notifications.data.map((notification,index) => {
      if(notification.type === "Review"){
        return(
          <li onClick={() => this.goToReviewPage(notification)}>
            <div className="msgList">
              <div className="msgImg">
                <span className="msgIcon reviewReq">
                  <i className="fa fa-envelope-o"></i>
                </span>
              </div>
              <div className="msgContent">
                <span><b>{`${notification.user} submitted- ${notification.profile} profile from ${notification.campaign} for review`}</b></span>
                <span>{notification.time}</span>
              </div>
            </div>
          </li>
        );
      }else if(notification.type === "Approved"){
        return(
          <li onClick={() => this.goToReviewPage(notification)}>
            <div className="msgList">
              <div className="msgImg">
                <span className="msgIcon comment">
                  <i className="fa fa-check"></i></span>
              </div>
              <div className="msgContent">
                <span><b>{`${notification.user} approved - ${notification.profile} profile from ${notification.campaign}`}</b></span>
                <span>{notification.time}</span>
              </div>
            </div>
          </li>
        );
      }else{
        return(
          <li onClick={() => this.goToReviewPage(notification)}>
            <div className="msgList">
              <div className="msgImg">
                <span className="msgIcon comment">
                  <i className="fa fa-commenting-o"></i></span>
              </div>
              <div className="msgContent">
                <span><b>{`${notification.user} commented on- ${notification.profile} profile from ${notification.campaign}`}</b></span>
                <span>{notification.time}</span>
              </div>
            </div>
          </li>
        );
      }
    });
  }

  showExport(){
    if(this.props.signInStatus === "loggedin"){
      let user = ((this.props.selections.user).split("@"));
      let userName = user[0];
      console.log("Teting User Name", userName);		
    return(
      <ul className="nav navbar-nav pull-right">
        <li><a onClick={() => this.campaignHome()}><i className="fa fa-home" style={{"fontSize":"18px"}}></i> </a></li>
        <li><a  onClick={() => this.exportedInfoPage()}><i className="fa fa-database"></i></a></li>
      {/*Notification starts here  */}
      <li className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <span className="blink" style={{'display':'none'}}></span><i onClick={() => this.getFiveNotifications()} className="fa fa-bell-o"></i>
          </a>
          <ul className="dropdown-menu dropdown-menu-right msgBlk">

            <li className="msgInfoBar">
              <div className="info">
                <span className="title">Notification</span>
                <span className="readAll"><i className="fa fa-check"></i></span>
              </div>
            </li>
            {this.renderNotification()}
            <li className="readAll">
              <div onClick={() => this.getNotificationData()}>
                <span className="title">View more</span>
              </div>
            </li>
           </ul>
        </li>
        {/* Notification ends here */}
        <li className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-user-o"></i> <span className="caret"></span>
          </a>
          <ul className="dropdown-menu dropdown-menu-right">
            <li>
              <div className="profile">
                <div className="profileImg">
                  <span className="profileTag">{((this.props.selections.user).charAt(0)).toUpperCase()}</span>
                </div>
                <div className="ProfileInfo">
                  <span style={{"display":"block"}}><b style={{"textTransform":"capitalize"}}>{userName}</b></span>
                  <span>{this.props.selections.user}</span>
                </div>
              </div>
            </li>
            <li role="separator" className="divider"></li>
            {/*
            <li><a >My Campaigns</a></li>
            <li><a >Review Requests</a></li>
            <li><a>Exported Narratives</a></li>
            */}
            <li><Link to={'/helpmanual'} target="_blank">Help</Link></li>
            <li role="separator" className="divider"></li>
            <li><a onClick={() => this.signout()}>Sign out</a ></li>
          </ul>
        </li>
      </ul>
    )
  }
  }





  render() {
    return (
      <div>
        <nav className="navbar  cisco_header">
        <div className="container-fluid navWidth">
          <div className="navbar-header col-sm-3 col-md-2 coustom-logo-nav">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>

            <div className="logobg">
              <img src={require('../logo.jpg')} className="img-responsive" style={{"maxHeight": "50px"}} />
            </div>
          </div>
          <div className="tagline"><h2>Word<span className="craft">Craft</span></h2>
          </div>

            {this.showExport()}

        </div>
      </nav>

        <div id="exportedModal">
            <div id="exportedContent">
                {(this.props.signInStatus === "loggedin")?<ExportedNarrative />:<div>kk</div>}
            </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    selections : state.globalSelection,
    modalState: state.exportModal,
    signInStatus : state.signInStatus,
    notifications:state.notifications,
    reviewHomeStatus:state.reviewHomeStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({modifyCampaign,modifyReviewHomeStatus, getReviewContent,getNotificationData,modifySignInStatus, modifyCampaignHomeStatus,modifyIndex:modifyIndex,exportedInfo:exportedInfo, logout}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(Header);
