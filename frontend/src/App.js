import React, { Component, Fragment } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";
import Start from "./Containers/Start/Start";
// import Wall from "./Containers/Wall/Wall";
// import CreatePost from "./Containers/CreatePost/CreatePost";
// import GoFishing from "./Containers/GoFishing/GoFishing";
import Classroom from "./Containers/Classroom/Classroom";
import Teacher from "./Containers/Teacher/Teacher";
import TeacherClassroomDetail from "./Containers/TeacherClassroomDetail/TeacherClassroomDetail";
import TeacherWordLists from "./Containers/TeacherWordLists/TeacherWordLists";
import FindPeople from "./Containers/FindPeople/FindPeople";
import Settings from "./Containers/Settings/Settings";
import LoginForm from "./Components/Authentication/Login/LoginForm";
import Modal from "./Components/UI/Modal/Modal";
import SignupForm from "./Components/Authentication/Signup/SignupForm";

import axios from "axios";

import withErrorHandler from "./hoc/withErrorHandler/withErrorHandler";
import PrivateRoute from "./hoc/PrivateRoute/PrivateRoute";
import PublicRoute from "./hoc/PublicRoute/PublicRoute";
import SignupRoute from "./hoc/SignupRoute/SignupRoute";
import TestAnswers from "./Containers/TestAnswers/TestAnswers";
import happyLogo from "./Assets/happy.png";
import WordLists from "./Containers/WordLists/WordLists";
import WordListDetail from "./Containers/WordListDetail/WordListDetail";
import Test from "./Containers/Test/Test";
import TeacherWordListDetail from "./Containers/TeacherWordListDetail/TeacherWordListDetail";
import CreateTest from "./Containers/CreateTest/CreateTest";
import TeacherTests from "./Containers/TeacherTests/TeacherTests";

class App extends Component {
  state = {
    logged_in: !!localStorage.getItem("token"),
    email: "",
    password: null,
    user_id: null,
    account_type: "",
    sign_in: false,
    success: false,
    message: ""
  };

  componentDidMount() {
    if (this.state.logged_in) {
      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      this.setState({
        email: user.email,
        user_id: user.id,
        account_type: user.account_type
      });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      this.setState({
        logged_in: false,
        sign_in: false,
        email: "",
        account_type: "",
        user_id: null
      });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();

    const headers = {
      "Content-Type": "application/json"
    };
    axios
      .post("/api/user/login/", data, headers)
      .then(res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data));
        this.setState({
          logged_in: true,
          email: res.data.email,
          user_id: res.data.id,
          account_type: res.data.account_type
        });
      })
      .catch(error => {});
  };

  handle_signup = (e, data) => {
    e.preventDefault();

    const headers = {
      "Content-Type": "application/json"
    };
    axios
      .post("/api/user/create/", data, headers)
      .then(res => {
        if (res.status === 201) {
          this.setState(
            {
              sign_in: true
            },
            () => {
              this.setState({ sign_in: false });
            }
          );
        }
      })
      .catch(error => {});
  };

  handle_logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    this.setState({
      logged_in: false
    });
  };

  updateProfileHandler = (e, data) => {
    e.preventDefault();

    let profile = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email
    };

    if (data.changePassword === true) {
      profile = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password
      };
    }

    const formData = new FormData();
    Object.keys(profile).map(item => formData.append(item, profile[item]));
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .patch("/api/user/me/", formData, { headers })
      .then(res => {
        this.setState({ email: res.data.email });
        this.setState({
          success: true,
          message: "Successful user data update."
        });
      })
      .catch(error => {});
  };

  successConfirmedHandler = () => {
    this.setState({ success: null, message: "" });
  };

  render() {
    return (
      <BrowserRouter>
        <Layout
          logged_in={this.state.logged_in}
          email={this.state.email}
          user_id={this.state.user_id}
          handle_logout={this.handle_logout}
        >
          <Modal show={this.state.success} modalClosed={this.successConfirmedHandler}>
            <img src={happyLogo} alt="happy" />
            {this.state.message}
          </Modal>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={Start}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/start"
              component={Start}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/word-lists"
              component={WordLists}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/word-lists/:wordlistID"
              component={WordListDetail}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/word-lists/:wordlistID/test"
              component={Test}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/word-lists/:wordlistID/test/:testID"
              component={TestAnswers}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              path="/classroom"
              component={Classroom}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher"
              component={Teacher}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID"
              component={TeacherClassroomDetail}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID/teacher-tests"
              component={TeacherTests}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID/word-lists"
              component={TeacherWordLists}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID/word-lists/:wordlistID"
              component={TeacherWordListDetail}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID/word-lists/:wordlistID/create-test"
              component={CreateTest}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              path="/find-people"
              component={FindPeople}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              path="/profile-settings"
              component={Settings}
              logged_in={this.state.logged_in}
              updateProfileHandler={this.updateProfileHandler}
            />
            <PublicRoute
              path="/login"
              component={LoginForm}
              logged_in={this.state.logged_in}
              handle_login={this.handle_login}
            />
            <SignupRoute
              path="/signup"
              component={SignupForm}
              sign_in={this.state.sign_in}
              handle_signup={this.handle_signup}
            />
            <Route path="/" render={props => <Fragment>404 Nie znaleziono</Fragment>} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default withErrorHandler(App, axios);
