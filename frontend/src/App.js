import React, {Component, Fragment} from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";

import Layout from './hoc/Layout/Layout';
import Start from "./Containers/Start/Start";
import Wall from "./Containers/Wall/Wall";
import CreatePost from "./Containers/CreatePost/CreatePost"
import GoFishing from "./Containers/GoFishing/GoFishing";
import FindPeople from "./Containers/FindPeople/FindPeople";
import Settings from "./Containers/Settings/Settings";
import LoginForm from "./Components/Authentication/Login/LoginForm";
import SignupForm from "./Components/Authentication/Signup/SignupForm";
import axios from 'axios';

import withErrorHandler from "./hoc/withErrorHandler/withErrorHandler";
import PrivateRoute from "./hoc/PrivateRoute/PrivateRoute";
import PublicRoute from "./hoc/PublicRoute/PublicRoute";
import SignupRoute from "./hoc/SignupRoute/SignupRoute";
import Followers from "./Containers/Followers/Followers";

class App extends Component {
  state = {
    logged_in: !!localStorage.getItem('token'),
    email: '',
    user_id: null,
    account_type: '',
    sign_in: false
  };

  componentDidMount() {
    if (this.state.logged_in) {
      axios.get('/api/user/me/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      }).then(response => {
        if (response.data.id) {
          this.setState({email: response.data.email, user_id: response.data.id, account_type: response.data.account_type});
        } else {
          localStorage.removeItem('token');
          this.setState({logged_in: false, sign_in: false, email: '', account_type: '', user_id: null});
        }
      }).catch(error => {});
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json'
    };

    axios
      .post('/api/user/login/', data, headers)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        this.setState({logged_in: true, email: response.data.email, user_id: response.data.id, account_type: response.data.account_type});
      })
      .catch(error => {});
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json'
    };
    axios
      .post('/api/user/create/', data, headers)
      .then(response => {
        if (response.status === 201) {
          this.setState({
            sign_in: true
          }, () => {
            this.setState({sign_in: false})
          });
        }
      })
      .catch(error => {});
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({logged_in: false, email: '', account_type: '', user_id: null});
  };

  render() {
    return (
      <BrowserRouter>
        <Layout
          logged_in={this.state.logged_in}
          email={this.state.email}
          user_id={this.state.user_id}
          handle_logout={this.handle_logout}>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={Start}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              exact
              path="/start"
              component={Start}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              path="/wall"
              component={Wall}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              path="/create-post"
              component={CreatePost}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              path="/go-fishing"
              component={GoFishing}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              path="/find-people"
              component={FindPeople}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              path="/followers"
              component={Followers}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PrivateRoute
              path="/profile-settings"
              component={Settings}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}/>
            <PublicRoute
              path="/login"
              component={LoginForm}
              logged_in={this.state.logged_in}
              handle_login={this.handle_login}/>
            <SignupRoute
              path="/signup"
              component={SignupForm}
              sign_in={this.state.sign_in}
              handle_signup={this.handle_signup}/>
            <Route
              path="/"
              render={(props) => <Fragment>
              404 Nie znaleziono
            </Fragment>}/>
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default withErrorHandler(App, axios);
