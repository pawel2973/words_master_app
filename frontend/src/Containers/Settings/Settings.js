import React, { Component } from "react";
import Wrapper from "../../Components/UI/Wrapper/Wrapper";
import { Button, Col, Form } from "react-bootstrap";
import classes from "./Settings.module.css";
import axios from "axios";

class Settings extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: null,
    changePassword: false
  };

  componentDidMount() {
    this.getProfileData();
  }

  getProfileData = () => {
    axios
      .get("/api/user/me/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        this.setState({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email
        });
      })
      .catch(error => {});
  };

  changePasswordHandler = () => {
    const show = this.state.changePassword;
    this.setState({ changePassword: !show });
  };

  render() {
    const passwordForm = (
      <Form.Row className={classes.FormRow}>
        <Col>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={event => this.setState({ password: event.target.value })}
          />
        </Col>
      </Form.Row>
    );

    return (
      <div>
        <Wrapper>
          <h1>General Account Settings</h1>
          <Form>
            <Wrapper>
              <h5>Personal information</h5>
              <hr />
              <Form.Group>
                <Form.Row className={classes.FormRow}>
                  <Col>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First name"
                      value={this.state.firstName}
                      onChange={event =>
                        this.setState({ firstName: event.target.value })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last name"
                      value={this.state.lastName}
                      onChange={event =>
                        this.setState({ lastName: event.target.value })
                      }
                    />
                  </Col>
                </Form.Row>
                <Form.Row className={classes.FormRow}>
                  <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={event =>
                        this.setState({ email: event.target.value })
                      }
                    />
                  </Col>
                </Form.Row>
                {this.state.changePassword ? passwordForm : null}
              </Form.Group>
            </Wrapper>
            <Button
              onClick={e => this.props.updateProfileHandler(e, this.state)}
              className={classes.ButtonUpdate}
              variant="primary"
              size="sm"
            >
              Update
            </Button>
            <Button
              onClick={this.ButtonChangePass}
              className={classes.Button2}
              variant="primary"
              size="sm"
            >
              {this.state.changePassword ? "I'm not sure" : "Change password"}
            </Button>
          </Form>
        </Wrapper>
      </div>
    );
  }
}

export default Settings;
