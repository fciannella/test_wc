import React, { Component } from 'react';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {checkuser, ssoStatus, modifySignInStatus, modifyCampaignHomeStatus, modifyIndex, getReviewContent} from "../actions/index";


class Notifications extends Component {

  constructor(props){
    super(props);
    this.state = {
      checkboxState: 'checked',
      currentIndex:1
    }
  }
  componentWillReceiveProps(nextprops){
    if(nextprops.signInStatus !=="loggedin"){
      this.props.history.push('/signin');
    }
    if(nextprops.campaignHomeStatus === "goToCampaignList"){
      this.props.history.push("/campaignlist");
    }
  }

  componentWillMount(){
    console.log("i cam in noti");
    if(this.props.signInStatus !=="loggedin"){
        this.props.history.push('/signin');
        this.props.modifyCampaignHomeStatus({campaignHome:"inNotificationsPage"});
    }
    window.scrollTo(0, 0);
  }

  multiSelect(event){
    let checkBoxStatus = '';
    if(this.state.checkboxState === 'checked')
    {
      checkBoxStatus = '';
    }
    else {
      checkBoxStatus = 'checked';
    }
    this.setState({checkboxState: !this.state.checkboxState});

  }
  prevPage(event){
    let totalPages = 5;
    if(this.state.currentIndex >1){
      let nextIndex = (this.state.currentIndex-1);
      this.setState({currentIndex:nextIndex});
      this.props.modifyIndex({index:nextIndex});
      this.props.getNotificationData(this.props.selections);
    }
  }
  nextPage(event){
    let totalPages = 5;
    if(this.state.currentIndex <(totalPages)){
      let nextIndex = (this.state.currentIndex+1);
      this.setState({currentIndex:nextIndex});
      this.props.modifyIndex({index:nextIndex});
      this.props.getNotificationData(this.props.selections);
    }
  }

  goToReviewPage(selection){
    this.modifyCampaign({campaign:selection.campaign});
    this.props.getReviewContent({user:this.props.selections.user,campaign:[selection.campaign],profile:[selection.profile]});
    this.props.history.push('/review');
  }

  renderNotificationTD(notification){
    return(
      <td className="col-3 ">
        <div className="ntType">
          <span><b>{(notification.user).split("@")[0]}</b></span>
          <span> | </span>
          <span>{notification.user}</span>
        </div>
        <div className="ntContent">
          <span className="ntSpan">
            <b>Campaign:</b> {notification.campaign}
          </span>
          <span>
            -
          </span>
          <span className="ntSpan">
            <b>Profile:</b> {notification.profile}
          </span>
        </div>
      </td>
    );
  }

  renderNotificationRows(){
    return this.props.notifications.data.map((notification,index) => {
      if(notification.type === "Review"){
        return(
          <tr className="ntLink" onClick={() => this.goToReviewPage(notification)}>
              <td className="center col-1">
                <input type="checkbox"/>
              </td>
              <td className="col-2">
                <span className="msgIcon reviewReq">
                  <i className="fa fa-envelope-o"></i>
                </span>
              </td>
              {this.renderNotificationTD(notification)}
              <td className="center col-4"><span className="reqType">Review</span></td>
              <td className="center col-5"><span className="ntDate">{notification.time}</span></td>
          </tr>
        );
      }else if(notification.type === "Comment"){
        return(
          <tr className="ntLink" onClick={() => this.goToReviewPage(notification)}>
              <td className="center col-1">
                <input type="checkbox" />
              </td>
              <td className="col-2">
                <span className="msgIcon reviewReq comment">
                  <i className="fa fa-commenting-o"></i>
                </span>
              </td>
              {this.renderNotificationTD(notification)}
              <td className="center col-4"><span className="reqType comment">Comment</span></td>
              <td className="center col-5"><span className="ntDate">{notification.time}</span></td>
          </tr>

        );
      }else{
        return(
          <tr className="ntLink" onClick={() => this.goToReviewPage(notification)}>
              <td className="center col-1">
                <input type="checkbox" />
              </td>
              <td className="col-2">
                <span className="msgIcon reviewReq approved">
                  <i className="fa fa-check"></i>
                </span>
              </td>
              {this.renderNotificationTD(notification)}
              <td className="center col-4"><span className="reqType approved">Approved</span></td>
              <td className="center col-5"><span className="ntDate">{notification.time}</span></td>
          </tr>
        );
      }
    });
  }

  render() {
    return (
      <div style={{'position':'relative'}}>
      <div>
        <Header />
      </div>
      <div className="setupContainer">
          <div className="container-fluid padding-top ">
            <div className="row cPaddingBottom">
               <div className="col-xs-12  col-sm-12 col-md-12 winSetup">
                  <div className="titleBar">
                    <span className="titleText"><i className="fa fa-github"></i> Notification Center  </span>
                  </div>

                  <div className="table-responsive  ntBlock">
                    <div className="blkShadow">
                      <div className="ntNave">
                        <div className="input-group ntRow">
                            <input type="checkbox"
                                onClick = {(event)=>this.multiSelect(event)}
                                checked={this.state.checkboxState}
                              />
                            <span className="glyphicon glyphicon-triangle-bottom  drp-cart" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></span>

                            <ul className="dropdown-menu">
                              <li className="lstCustom" onClick = {(event)=>this.multiSelect(event)}>All</li>
                              <li className="lstCustom">None</li>
                              <li className="lstCustom">Read</li>
                              <li className="lstCustom">Unread</li>
                            </ul>
                        </div>
                        <div className="ntOthers">
                          <div className="ntBtn" data-toggle="tooltip" data-placement="bottom" title="Refresh">
                           <i className="glyphicon glyphicon-refresh proEdit"></i>
                          </div>
                          <div className="ntBtn" data-toggle="tooltip" data-placement="bottom" title="Mark as read">
                           <i className="fa fa-check-square-o proEdit"></i>
                          </div>
                          <div className="ntBtn" data-toggle="tooltip" data-placement="bottom" title="Delete">
                           <i className="fa fa-trash  proEdit"></i>
                          </div>
                        </div>
                        <div className="ntRow pull-right">
                          <span className="ntText">Showing {this.props.notifications.start} - {this.props.notifications.end} of {this.props.notifications.nrow}  </span>
                          <div className="btn-group">
                              <a className="btn btn-default" onClick = {(event)=>this.prevPage(event)}><i className="fa fa-angle-left"></i></a>
                              <a className="btn btn-default" onClick = {(event)=>this.nextPage(event)}><i className="fa fa-angle-right"></i></a>
                          </div>
                        </div>

                      </div>
                    </div>
                    <table className="table">
                      {/* <!-- Notification row start  --> */}
                      {this.renderNotificationRows()}
                      {/* <!-- Notification row Ends  --> */}
                    </table>
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
    campaignHomeStatus : state.campaignHomeStatus,
    notifications:state.notifications
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({checkuser:checkuser, ssoStatus:ssoStatus, getReviewContent:getReviewContent,
                             modifySignInStatus:modifySignInStatus, modifyCampaignHomeStatus:modifyCampaignHomeStatus, modifyIndex:modifyIndex}, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(Notifications);
