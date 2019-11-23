import React, { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

const Toolbar = props => {
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

        <Nav.Link
          as={NavLink}
          to="/wall"
          exact={true}
          activeStyle={{ color: "white" }}
        >
          Wall
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/create-post"
          exact={true}
          activeStyle={{ color: "white" }}
        >
          Create Post
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/find-people"
          exact={true}
          activeStyle={{ color: "white" }}
        >
          Find People
        </Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link style={{ color: "white" }}>{props.email}</Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/followers"
          exact={true}
          activeStyle={{ color: "white" }}
        >
          <i className="fas fa-smile" />
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/profile-settings"
          exact={true}
          activeStyle={{ color: "white" }}
        >
          <i className="fas fa-user-cog" />
        </Nav.Link>
        <Nav.Link to="/login" onClick={props.handle_logout}>
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
        {props.logged_in ? logged_in_nav : logged_out_nav}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Toolbar;
