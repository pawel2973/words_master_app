import axios from "axios";
import withErrorHandler from "./hoc/withErrorHandler/withErrorHandler";
import React, { Component, Fragment } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Layout from "./hoc/Layout/Layout";
import Start from "./Containers/UserContainers/Start/Start";
import Teacher from "./Containers/TeacherContainers/Teacher/Teacher";
import TeacherClassroomDetails from "./Containers/TeacherContainers/TeacherClassroomDetails/TeacherClassroomDetails";
import TeacherWordLists from "./Containers/TeacherContainers/TeacherWordLists/TeacherWordLists";
import Settings from "./Containers/UserContainers/Settings/Settings";
import LoginForm from "./Components/Authentication/Login/LoginForm";
import Modal from "./Components/UI/Modal/Modal";
import SignupForm from "./Components/Authentication/Signup/SignupForm";
import PrivateRoute from "./hoc/PrivateRoute/PrivateRoute";
import PublicRoute from "./hoc/PublicRoute/PublicRoute";
import SignupRoute from "./hoc/SignupRoute/SignupRoute";
import TestAnswers from "./Containers/UserContainers/TestAnswers/TestAnswers";
import happyLogo from "./Assets/happy.png";
import WordLists from "./Containers/UserContainers/WordLists/WordLists";
import Test from "./Containers/UserContainers/Test/Test";
import TeacherWordListDetail from "./Containers/TeacherContainers/TeacherWordListDetail/TeacherWordListDetail";
import TeacherCreateTest from "./Containers/TeacherContainers/TeacherCreateTest/TeacherCreateTest";
import TeacherTests from "./Containers/TeacherContainers/TeacherTests/TeacherTests";
import Classrooms from "./Containers/ClassroomContainers/Classrooms/Classrooms";
import ClassroomDetails from "./Containers/ClassroomContainers/ClassroomDetails/ClassroomDetails";
import ClassroomWordList from "./Containers/ClassroomContainers/ClassroomWordList/ClassroomWordList";
import ClassroomWordListDetail from "./Containers/ClassroomContainers/ClassroomWordListDetail/ClassroomWordListDetail";
import ClassroomTest from "./Containers/ClassroomContainers/ClassroomTest/ClassroomTest";
import ClassroomTestsResults from "./Containers/ClassroomContainers/ClassroomTestsResults/ClassroomTestsResults";
import ClassroomTestsResultsAnswers from "./Containers/ClassroomContainers/ClassroomTestsResultsAnswers/ClassroomTestsResultsAnswers";
import TeacherTestDetails from "./Containers/TeacherContainers/TeacherTestDetails/TeacherTestDetails";
import TeacherStudentTestsAnswers from "./Containers/TeacherContainers/TeacherStudentTestsAnswers/TeacherStudentTestsAnswers";
import StudentStatistics from "./Containers/TeacherContainers/StudentStatististics/StudentStatistics";
import WordListDetails from "./Containers/UserContainers/WordListDetails/WordListDetails";
import ClassroomActiveTests from "./Containers/ClassroomContainers/ClassroomActiveTests/ClassroomActiveTests";
import Learn from "./Containers/UserContainers/Learn/Learn";
import Simple from "./Containers/UserContainers/Learn/Games/Simple/Simple";
import FourWords from "./Containers/UserContainers/Learn/Games/FourWords/FourWords";

class App extends Component {
  state = {
    logged_in: !!localStorage.getItem("token"),
    email: "",
    account_type: "",
    message: "",
    password: null,
    user_id: null,
    sign_in: false,
    success: false
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
              component={WordListDetails}
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
              path="/word-lists/:wordlistID/learn"
              component={Learn}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/word-lists/:wordlistID/learn/simple"
              component={Simple}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/word-lists/:wordlistID/learn/four-words"
              component={FourWords}
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
              exact
              path="/teacher"
              component={Teacher}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID"
              component={TeacherClassroomDetails}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />
            <PrivateRoute
              exact
              path="/teacher/:classroomID/student/:studentID"
              component={StudentStatistics}
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
              path="/teacher/:classroomID/teacher-tests/:testID"
              component={TeacherTestDetails}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/teacher/:classroomID/teacher-tests/:testID/:studenttestID"
              component={TeacherStudentTestsAnswers}
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
              component={TeacherCreateTest}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms"
              component={Classrooms}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID"
              component={ClassroomDetails}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID/word-lists"
              component={ClassroomWordList}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID/word-lists/:wordlistID"
              component={ClassroomWordListDetail}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID/tests"
              component={ClassroomActiveTests}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID/tests/:testID"
              component={ClassroomTest}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID/tests-results"
              component={ClassroomTestsResults}
              logged_in={this.state.logged_in}
              user_id={this.state.user_id}
            />

            <PrivateRoute
              exact
              path="/classrooms/:classroomID/tests-results/:testID"
              component={ClassroomTestsResultsAnswers}
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
