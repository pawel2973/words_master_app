import axios from "../../../axios";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row, Jumbotron } from "react-bootstrap";
import classes from "./Start.module.css";

class Start extends Component {
  state = {
    user_id: this.props.user_id,
    user: {}
  };

  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails = () => {
    const headers = { Authorization: `Token ${localStorage.getItem("token")}` };
    axios
      .get("/api/user/me/", { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({ user: { ...res.data } });
        }
      })
      .catch(error => {});
  };

  render() {
    return (
      <Row>
        <Col>
          <Jumbotron className={classes.Jumbo}>
            <h1>Witaj w bezpłatnej aplikacji e-learningowej do nauki języka angielskiego!</h1>
            <p>
              Cieszymy się, że jesteś z nami <strong>{this.state.user.first_name}</strong>. Szlifuj swój angielski wraz
              z aplikacją Wordsmaster! Sprawdź listę poniżej i poznaj niektóre z możliwości aplikacji.
            </p>
            <div>
              <strong>Oto kilka przydatnych funkcji:</strong>
              <ul>
                <li>Twórz własne listy słówek.</li>
                <li>Dodawaj słówka do swojej listy.</li>
                <li>Uruchom tryb nauki i poszerz swoją wiedzę w prosty sposób.</li>
                <li>Twórz testy na podstawie stworzonych list słówek.</li>
                <li>Śledź swoje postępy.</li>
                <li>Dołącz do klasy lub zostań nauczycielem.</li>
                <li>Testuj wiedzę swoich uczniów.</li>
                <li>Analizuj wyniki swojej klasy.</li>
              </ul>
            </div>
            <hr className={classes.hr} />
            <p>Kliknij w przycisk poniżej, stwórz własną listę słówek i rozpocznij naukę :)</p>
            <p>
              <Link to={{ pathname: "/word-lists" }}>
                <Button variant="primary">Rozpocznij</Button>
              </Link>
            </p>
            <p className="text-right">
              <em>
                Zalogowano jako: <br />
                {this.state.user.first_name} {this.state.user.last_name} / {this.state.user.email}
              </em>
            </p>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}

export default withErrorHandler(Start, axios);
