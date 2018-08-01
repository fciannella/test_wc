import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Header from './header';
import { signUp } from '../actions/index';
import { connect } from "react-redux";
import { bindActionCreators } from "redux"

class SignUp extends Component {
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

  signup() {
    let emailRegex = /^(?:(?:\w)+[._+]?(?!\.)){0,3}\w@(?:(?:[a-z])+(-|\.)?(?!\.)){0,4}[a-z]\.[a-z]{2,}$/g;

    if(emailRegex.test(this.state.email)){
      this.props.signUp(this.state.email,this.state.password)
      .then(res => {
        this.setState({showEmailError: false});
        if(res.payload.data.success){
          this.props.history.push("/signin");
        }else{
          if(res.payload.data.errors.email){
            this.setState({showExistError: true})
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
  				<Link to={'/signin'} className="sign trans loginTab">
  					<div>LOGIN</div>
  				</Link>
  				<div className="sign trans registerTab activeTab">
  					<div>REGISTER</div>
  				</div>
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
  						{this.state.showEmailError ? <p className="errorMsg">Please Enter a valid Email Id</p> : null}
  						{this.state.showExistError ? <p className="errorMsg">Email id already exist</p> : null}
  						<div className="col-xs-12 pad0">
  							<button className="mbtn btnType-save noFloat" onClick={() => this.signup()}><span className="btnLabel">Register</span><i className="fa fa-long-arrow-right btnPaddLeft" aria-hidden="true"> </i></button>
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

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signUp }, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUp);
