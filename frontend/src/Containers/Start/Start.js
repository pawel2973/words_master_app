import React, { Component, Fragment } from "react";
import { Redirect } from "react-router";
import { Button, Col, Row, Jumbotron } from "react-bootstrap";
import classes from "./Start.module.css";
import axios from "../../axios";

class Start extends Component {
  state = {
    user: {},
    user_id: this.props.user_id,
    switchToWordList: false
  };

  componentDidMount() {
    axios
      .get("/api/user/me/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({ user: res.data });
        }
      })
      .catch(error => {});
  }

  switchToWordListHandler = () => {
    const switchToWordList = this.state.switchToWordList;
    this.setState({ switchToWordList: !switchToWordList });
  };

  render() {
    if (this.state.switchToWordList) {
      return <Redirect to={{ pathname: "/word-lists/" }} />;
    }
    return (
      <Fragment>
        <Row>
          <Col>
            <Jumbotron className={classes.Jumbo}>
              <h1>
                Witaj w bezpłatnej aplikacji e-learningowej do nauki języka
                angielskiego!
              </h1>
              <p>
                Cieszymy się, że jesteś z nami{" "}
                <strong>{this.state.user.first_name}</strong>. Szlifuj swój
                angielski wraz z aplikacją Wordsmaster! Sprawdź listę poniżej i
                poznaj niektóre z możliwości aplikacji.
              </p>
              <div>
                <strong>Oto kilka przydatnych funkcji:</strong>
                <ul>
                  <li>Twórz własne listy słówek.</li>
                  <li>Dodawaj słówka do swojej listy.</li>
                  <li>
                    Uruchom tryb nauki i poszerz swoją wiedzę w prosty sposób.
                  </li>
                  <li>Twórz testy na podstawie stworzonych list słówek.</li>
                  <li>Śledź swoje postępy.</li>
                  <li>Dołącz do klasy lub zostań nauczycielem.</li>
                  <li>Testuj wiedzę swoich uczniów.</li>
                  <li>Analizuj wyniki swojej klasy.</li>
                </ul>
              </div>
              <hr className={classes.hr} />
              <p>
                Kliknij w przycisk poniżej, stwórz własną listę słówek i
                rozpocznij naukę :)
              </p>
              <p>
                <Button
                  variant="primary"
                  onClick={this.switchToWordListHandler}
                >
                  Rozpocznij
                </Button>
              </p>
              <p className="text-right">
                <em>
                  Zalogowano jako: <br />
                  {this.state.user.first_name} {this.state.user.last_name} /{" "}
                  {this.state.user.email}
                </em>
              </p>
            </Jumbotron>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default Start;
