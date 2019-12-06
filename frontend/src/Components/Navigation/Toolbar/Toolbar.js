import React, { Component, Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

class Toolbar extends Component {
  // componentDidUpdate(prevProps) {
  //   // Typowy sposób użycia (nie zapomnij porównać właściwości):
  //   if (this.props.email !== prevProps.email) {
  //     // this.componentDidMount();
  //     // console.log("ZMIANAAA!!!")
  //   }
  // }

  // static getDerivedStateFromProps(props, state) {

  //   console.log(props);

  //   // Return null if the state hasn't changed
  //   return state;
  // }

  render() {
    const logged_out_nav = (
      <Nav>
        <Nav.Link as={NavLink} to="/login" activeStyle={{ color: "white" }}>
          Login
        </Nav.Link>
        <Nav.Link as={NavLink} to="/signup" activeStyle={{ color: "white" }}>
          Sign-up
        </Nav.Link>
      </Nav>
    );

    const logged_in_nav = (
      <Fragment>
        <Nav className="mr-auto">
          <Nav.Link
            as={NavLink}
            // onClick={() => window.location.refresh()}
            to="/"
            exact={true}
            activeStyle={{ color: "white" }}
          >
            Start
          </Nav.Link>

          <Nav.Link as={NavLink} to="/word-lists" exact={true} activeStyle={{ color: "white" }}>
            Word Lists
          </Nav.Link>

          <Nav.Link as={NavLink} to="/classrooms" exact={true} activeStyle={{ color: "white" }}>
            Classrooms
          </Nav.Link>

          <Nav.Link as={NavLink} to="/teacher" exact={true} activeStyle={{ color: "white" }}>
            Teacher
          </Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link style={{ color: "white" }}>{this.props.email}</Nav.Link>
          <Nav.Link as={NavLink} to="/followers" exact={true} activeStyle={{ color: "white" }}>
            <i className="fas fa-smile" />
          </Nav.Link>
          <Nav.Link as={NavLink} to="/profile-settings" exact={true} activeStyle={{ color: "white" }}>
            <i className="fas fa-user-cog" />
          </Nav.Link>
          <Nav.Link to="/login" onClick={this.props.handle_logout}>
            <i className="fas fa-sign-out-alt" />
          </Nav.Link>
        </Nav>
      </Fragment>
    );
    return (
      <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
        <Navbar.Brand as={Link} to="/">
          WordsMaster
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {this.props.logged_in ? logged_in_nav : logged_out_nav}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Toolbar;
