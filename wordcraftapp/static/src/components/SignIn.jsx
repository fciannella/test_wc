import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import '../style.css';
import { signIn, modifySignInStatus, modifyCampaignHomeStatus, modifyIndex, getNotificationData} from '../actions/index';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";



class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      }
    }
  }

  signin() {
    // debugger;
    let emailRegex = /^(?:(?:\w)+[._+]?(?!\.)){0,3}\w@(?:(?:[a-z])+(-|\.)?(?!\.)){0,4}[a-z]\.[a-z]{2,}$/g;

    if(emailRegex.test(this.state.email)){
      this.props.signIn(this.state.email,this.state.password)
      .then(res => {
        this.setState({showEmailError: false});
        this.setState({showPasswordError: false});
        if(res.payload.data.success){
          sessionStorage.setItem('loggedUser', this.state.email);
          this.props.modifySignInStatus({signInStatus:'loggedin', user: this.state.email});
          this.props.modifyCampaignHomeStatus({campaignHome:"inCampaignList"});
          this.props.modifyIndex({index:0});
          this.props.getNotificationData(this.props.selections);
          this.props.history.push("/campaignlist");
        }else{
          if(res.payload.data.errors.email){
            this.setState({showEmailError: true})
          }else if(res.payload.data.errors.password){
            this.setState({showPasswordError: true});
          }
        }
      })
    }else{
      this.setState({showEmailError: true});
    }
  }


  render() {

    return (
    <div>
      <Header />
      <div className="logiBg"></div>
    <div className="container-fluid loginAbs">
		<div className="row">
			<div className="col-xs-12 loginPage">
			  <div className="col-xs-12 loginButtons">
				<div className="sign trans loginTab activeTab">
					<div>LOGIN</div>
				</div>
				<Link to="/signup" className="sign trans registerTab">
					<div>REGISTER</div>
				</Link>
			  </div>
				<div className="col-xs-12 loginContentOuter">
				  <div className="col-xs-12 loginContentInner">
						<div className="form-horizontal">
						<div className="form-group has-success has-feedback">
						  <input type="text" className="form-control" id="inputSuccess1" aria-describedby="inputSuccess1Status" placeholder="User Name"
						  onChange={event => this.setState({email: event.target.value})}
						   />
						  <span className="glyphicon form-control-feedback loginIcon" aria-hidden="true"><i className="fa fa-user-o" aria-hidden="true"></i></span>
						</div>
						<div className="form-group has-success has-feedback">
						  <input type="password" className="form-control" id="inputSuccess2" aria-describedby="inputSuccess2Status" placeholder="Password"
						  onChange={event => this.setState({password: event.target.value})}
						   />
						  <span className="glyphicon form-control-feedback loginIcon" aria-hidden="true"><i className="fa fa-snowflake-o" aria-hidden="true"></i></span>
						</div>
						{this.state.showEmailError ? <p className="errorMsg">Please enter a valid Email Id</p> : null}
						{this.state.showPasswordError ? <p className="errorMsg">Your Password is wrong</p> : null}
						<div className="col-xs-12 pad0 center">
                  <button className="mbtn btnType-save noFloat" onClick={() => this.signin()}><span className="btnLabel">Login</span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
            </div>

						{this.state.error.message}
						</div>
				 </div>
				</div>

			</div>
		</div>
	</div>
  </div>

    )
  }
}
function mapStateToProps(state) {
  return {
    selections : state.globalSelection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signIn, modifySignInStatus, modifyCampaignHomeStatus, modifyIndex, getNotificationData}, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SignIn);
