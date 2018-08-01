import React, { Component } from 'react';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {modifySignInStatus,modifyReviewHomeStatus, modifyCampaignHomeStatus, submitComment, getReviewContent, approveProfile, getSearch} from "../actions/index";
import Textarea from 'react-textarea-autosize';

class Review extends Component {

  constructor(props){
    super(props);
    this.state={
      comment:'',
      email:"",
      switchView:"randomView",
      activeState:"form-control textarea disActive",
      searchRow:[{"columnName":'',"columnVal":''}]
    }
  }

  componentWillReceiveProps(nextprops){
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
    this.props.modifyCampaignHomeStatus({campaignHome:"inReview"});
    if(this.props.signInStatus !== "loggedin"){
       this.props.history.push('/signin');
    }
    window.scrollTo(0, 0);
  }

  submitComment(profile){
    this.props.submitComment({user:this.props.selections.user,profile:[profile],campaign:this.props.selections.campaign,comment:this.state.comment}, () => {
      if(this.props.reviewHomeStatus === "goToReviewPageFromList"){
        this.props.getReviewContent({user:this.props.selections.user,campaign:this.props.selections.campaign,profile:[]});
      }else{
        this.props.getReviewContent({user:this.props.selections.user,campaign:this.props.selections.campaign,profile:[profile]});
      }
      this.setState({comment:''});
    });
  }

  approveProfile(profile){
    this.props.approveProfile({profile:[profile.profile],language:profile.language,campaign:this.props.selections.campaign});
    document.getElementById(`approveButton${profile.profile}${profile.language}`).classList.add('disabled');

  }
  /* Switch View */
  switchView(event){
    let searchBox = document.getElementById('specCust');
    if(this.state.switchView==="randomView"){
      this.setState({"switchView":"customerSpecific"});
      if(searchBox.classList.contains('hidden')){
        searchBox.classList.remove('hidden')
      }

    }
    else{
        this.setState({"switchView":"randomView"})
        if(!searchBox.classList.contains('hidden')){
          searchBox.classList.add('hidden')
        }

    }

  }
  /* Add New Search Row */
  addNewSearchRow(){
    let newArr = [{"columnName":'',"columnVal":''}];
    this.setState({ searchRow: [...this.state.searchRow, ...newArr] });
  }
  /* delete search row from array */
  deleteSearchRow(event){
      let currentRow  = event.target.closest(".searchRow");
      let index = currentRow.getAttribute('id');
      index = parseInt(index);
      let  newSearchRow = this.state.searchRow;
      newSearchRow.splice(index,1);
      this.setState({searchRow: newSearchRow});

  }
  updateColumnName(event){
    let currentRow  = event.target.closest(".searchRow");
    let index = currentRow.getAttribute('id');
    index = parseInt(index);
    let searchRow = this.state.searchRow;
    searchRow[index].columnName = event.target.value;
    this.setState({searchRow:searchRow});

  }
  upadeSearchString(event){
    let currentRow  = event.target.closest(".searchRow");
    let index = currentRow.getAttribute('id');
    index = parseInt(index);
    let searchRow = this.state.searchRow;
    searchRow[index].columnVal = event.target.value;
    this.setState({searchRow:searchRow});
  }


searchColumns(event){
  let arr =   [{"columnName":'derived_party_id',"columnVal":7561417}];
  //this.props.getSearch({"columns":arr,"campaign":this.props.selections.campaign});
  this.props.getSearch({columns:this.state.searchRow, "campaign":this.props.selections.campaign});

}

  /* get column values */
  getColumnValues(columnName){
    return this.props.reviews.columnNames.map((column,index) => {

      if(columnName ===column){
        return(

            <option selected value={column}>{column}</option>
        )
      }
      else{
        return(

            <option  value={column}>{column}</option>
        )
      }

    })
}
  /* Add new Search Block */
  renderAddSearchRow(){

    let active = "delRow";
    if(this.state.searchRow.length>=2){
      active = "delRow";
    }
    else{
      active =  "delRow hidden"
    }
    return this.state.searchRow.map((search,index) => {
      let defaultOpt = "";
      let input = "";
      if(search.columnName === ""){
        defaultOpt =   <option disabled selected>Select Column</option>
        input = <input list={"inputValues_1"+index} disabled className="form-control" id={"inputString_"+index} value={search.columnVal} onChange = {(event)=>this.upadeSearchString(event)} placeholder="Search String" />;
      }
      else{
        defaultOpt =   <option disabled>Select Column</option>
          input = <input   className="form-control" id={"inputString_"+index} value={search.columnVal} onChange = {(event)=>this.upadeSearchString(event)} placeholder="Search String" />;
      }
      return(
        <div className="col-xs-12 searchRow" id={index} key={index}>
          <div className="form-group">
            <label for="exampleInputEmail1">Column Name</label>
            <select className="form-control" onChange = {(event)=>this.updateColumnName(event)}>
              {defaultOpt}
              {this.getColumnValues(search.columnName)}
            </select>
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Value</label>
            {input}

          </div>
            <span className={active} onClick={(event)=>this.deleteSearchRow(event)}>
              <i className="fa fa-minus-circle" id={"del_"+index}></i>
            </span>
          </div>

      )


    });
  }

  renderReviewContent(){
    if(this.props.reviews.message !== "false" &&  this.state.switchView === "randomView"){
      return this.props.reviews.profiles.map((profile,index) => {
        let emailhtml = "";
        let narrative = "";
        if(this.props.reviews.html[index]===""){
          emailhtml = "";
          narrative = <Textarea key={Math.random()} id={Math.random()} className="form-control textarea" type="text" placeholder="Please make selections to generate content"  style={{'marginBottom': '5px','color':'black', 'clear':'both', 'float':'none','overflow': 'hidden'}}  value={this.props.reviews.narrative[index]}  />;
          console.log("this.props.reviews.narrative[index]",this.props.reviews.narrative[index]);
        }
        else{
        emailhtml = <div dangerouslySetInnerHTML={{__html:this.props.reviews.html[index]}} />;
        narrative = "";
        }
        return(
          <div className="col-xs-12" style={{'marginBottom':'26px','float':'none'}}>
              <div className="row reviewCont">
                 <div className="col-xs-12 profileType">
                    <div style={{'position':'relative'}}>
                      <h3>{`Profile : ${profile} - ${this.props.reviews.languages[index]}`}</h3>
                      {(() => {

                        switch (this.props.reviews.roles[index]) {
                          case "Editor": return(
                              (() => {
                                switch (this.props.reviews.status[index]) {
                                  case "Approved":   return <div className="btnApprove disabled" style={{'color':'#fff','bottom': '5px'}}><div className="iconClose"><span>Approved <i className="fa fa-check-circle"></i></span></div></div>;
                                  case "Pending": return <div className="btnApprove disabled" style={{'color':'#fff','bottom': '5px'}}><div className="iconClose"><span>Pending <i className="fa fa-check-circle"></i></span></div></div>;
                                }
                              })())
                          case "Reviewer": return(
                              (() => {
                                switch (this.props.reviews.status[index]) {
                                  case "Approved":   return <div className="btnApprove disabled" style={{'color':'#fff','bottom': '5px'}}><div className="iconClose"><span>Approved <i className="fa fa-check-circle"></i></span></div></div>;
                                  case "Pending": return <div id={`approveButton${profile}${this.props.reviews.languages[index]}`} className="btnApprove" onClick={() => this.approveProfile({profile:profile,language:this.props.reviews.languages[index]})} style={{'color':'#fff','bottom': '5px'}}><div className="iconClose"><span>Approve <i className="fa fa-check-circle"></i></span></div></div>;
                                }
                              })())
                          }
                      })()}
                    </div>


                    <div className="content">
                        {emailhtml}
                        {narrative}

                    </div>
                 </div>


                 <div className="col-xs-12 commentBox">
                    <div className="wrapper center-block">
                      <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                      <div className="panel panel-default">
                        <div className="panel-heading" role="tab" id="headingOne">
                          <h4 className="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion" href={`#collapseOne${index}`} aria-expanded="true" aria-controls="collapseOne" className="collapsed">
                              Comments
                            </a>
                          </h4>
                        </div>
                        <div id={`collapseOne${index}`} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                          <div className="panel-body">
                            <div className="commentBg">
                               <p className="leaveComment">
                                 Leave a Reply
                               </p>
                               <textarea className="form-control" rows="3" value={this.state.comment} onChange={(event) => this.setState({comment:event.target.value})}></textarea>
                               <div className="postBtn">
                                  <button className="mbtn btnType-save" onClick={() => this.submitComment(profile)}><span className="btnLabel"> Post Comment</span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
                                </div>
                            </div>
                            <div className="preComments">
                              {this.renderComments(this.props.reviews.comments[index])}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>

                 </div>
              </div>
          </div>
        );
      });
    }
    else if(this.props.customerSpecific.html_preview!== "" &&  this.state.switchView === "customerSpecific"){
      let emailhtml = "";
      if(this.props.customerSpecific.contentType==="html")
      {
          emailhtml = <div dangerouslySetInnerHTML={{__html:this.props.customerSpecific.html_preview}} />;
      }
      else if(this.props.customerSpecific.contentType==="text"){
          //emailhtml = <textarea className="form-control" rows="3" value={this.props.customerSpecific.html_preview}></textarea>;
          emailhtml = <Textarea key={Math.random()} id={Math.random()} className="form-control textarea" type="text" placeholder="Please make selections to generate content"  style={{'marginBottom': '5px','color':'black', 'clear':'both', 'float':'none','overflow': 'hidden'}}  value={this.props.customerSpecific.html_preview}  />;
          console.log("this.props.customerSpecific.html_preview",this.props.customerSpecific.html_preview);
      }

      return(
      <div className="col-xs-12" style={{'marginBottom':'26px','float':'none'}}>
          <div className="row reviewCont">
             <div className="col-xs-12 profileType">
                <div className="content">
                    {emailhtml}
                </div>
              </div>
            </div>
          </div>
        )
    }
    else{
      return(
        <div className="col-xs-12" style={{'marginBottom':'26px','float':'none'}}>
            <div  className="row reviewCont" style={{"padding":"20px"}}>No Profiles have been submitted for review</div>
        </div>
      )
    }
  }

  renderComments(comments){
    return comments.comment.map((comment,index) => {
      return(
        <div className="col-xs-12">
          <div className="profile">
              <div className="profileImg">
                <span className="profileTag">{(comments.user[index].charAt(0)).toUpperCase()}</span>
              </div>
              <div className="ProfileInfo">
                <span><b style={{"text-transform":"capitalize"}}>{(comments.user[index].split("@")[0])}</b></span>
                <span>{comments.user[index]}</span>
              </div>
              <div className="ProfileInfo timeStamp">
                <span>{comments.time[index]}</span>

               </div>
          </div>
          <div className="txt">
              <p>{comment}</p>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
    <div>
    <div>
      <Header />
    </div>
    <div className="setupContainer">
      <div className="container-fluid padding-top ">
        <div className="row cPaddingBottom">
           <div className="col-xs-12  col-sm-12 col-md-12 winSetup">
              <div className="titleBar">
                <div className="titleText">
                  <i className="fa fa-caret-right"></i> {this.props.selections.campaign[0]}
                </div>
                <div className="col-xs-4 col-md-3 reviewOpt">
                   <label className="switch-light switch-ios" id="switchView">
                     <input type="checkbox" value="on" />
                     <span id="clickedHere">
                       <span onClick = {(event) => this.switchView(event)}>Random View</span>
                       <span onClick = {(event) => this.switchView(event)}>Customer Specific</span>
                       <a></a>
                     </span>
                   </label>
                </div>
              </div>
              {/* Cutomer Specific Search  start */}
              <div className="col-xs-12 clearAll grey specCust hidden" id="specCust">
                <div className="col-xs-12 pad0 specCustTable">
                  <div className="custom specCustCol">
                	   {this.renderAddSearchRow()}

                      <div className="col-xs-12 addMore" id="addMore">
                        <span>
                          <i className="fa fa-plus-circle "></i>
                        </span>
                        <span onClick={(event)=>this.addNewSearchRow()}>Add More Filters</span>
                      </div>
                  </div>
                  <div className="specCustCol">
                    <div className="cmpBlck" style={{"float":"right"}} onClick={(event)=>this.searchColumns(event)}>
                      <span>Search</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Cutomer Specific Search  End  */}
              {/* Profile block start */}
              {this.renderReviewContent()}
              {/*   Profile block over*/}
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
    reviews:state.reviews,
    customerSpecific:state.customerSpecificReview,
    reviewHomeStatus:state.reviewHomeStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({approveProfile:approveProfile, getReviewContent:getReviewContent,
                            getSearch:getSearch,
                             submitComment:submitComment,modifySignInStatus:modifySignInStatus,
                             modifyCampaignHomeStatus:modifyCampaignHomeStatus, modifyReviewHomeStatus:modifyReviewHomeStatus}, dispatch);
}


export default connect(mapStateToProps,mapDispatchToProps)(Review);
