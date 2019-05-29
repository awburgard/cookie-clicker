import React, { Component } from 'react';
import axios from 'axios';

const getCookie = (cookieName) => {
  // Get name followed by anything except a semicolon
  const cookieString = RegExp('' + cookieName + '[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./, '') : '');
}

class App extends Component {
  state = {
    clickCount: getCookie('count') || 0,
    usernameIsEditable: false,
    username: getCookie('username') || '',
    enteredUsername: '',
  }

  componentDidMount() {
    this.getCount();
    this.getUser();
  }

  getCount = () => {
    axios.get('/get-clicks')
      .then(response => {
        this.setState({
          clickCount: response.data.totalClicks,
        });
      })
      .catch(error => {
        console.log('error making add click post', error);
      });
  }

  getUser = () => {
    axios.get('/get-user')
      .then(response => {
        this.setState({
          username: response.data,
        });
      })
      .catch(error => {
        console.log('error making add user post', error);
      });
  }

  handleChange = (event) => {
    if (event.target.dataset.name === 'username') {
      this.setState({
        enteredUsername: event.target.value
      })
    }
  };

  handleClick = () => {
    axios.post('/add-click')
      .then(() => this.getCount())
      .catch(error => {
        console.log('error making add click post', error);
      });
  }

  editUsername = () => {
    this.setState({
      usernameIsEditable: true,
    });
  }

  saveUsername = () => {
    const data = { userName: this.state.enteredUsername };
    axios.post('/add-user', data)
      .then(() => this.getUser())
      .catch(error => {
        console.log('error making add user post', error);
      });
    this.setState({
      usernameIsEditable: false,
    });
  }

  endSession = () => {
    axios.delete('/end-session')
      .then(() => this.getUser())
      .then(() => this.getCount())
      .catch(error => {
        console.log('error deleting', error);
      });
    this.setState({
      usernameIsEditable: false,
    });
  }

  render() {
    let inputToShow;
    if (this.state.usernameIsEditable) {
      inputToShow = <input onChange={this.handleChange} type="text" placeholder="Username" value={this.state.enteredUsername} data-name="username" />
    } else {
      inputToShow = <div></div>
    }
    return (
      <div>
        <center>
          <h1>Click the Cookie!!</h1>
          <div>
            {this.state.username}
            {inputToShow}

            {this.state.usernameIsEditable ?
              <button onClick={this.saveUsername}>Save Username</button> :
              <div>
                <button onClick={this.editUsername}>Edit Username</button>
                <button onClick={this.endSession}>Log Out</button>
              </div>
            }
          </div>
          <p>{this.state.clickCount}</p>
          <span
            role="img"
            aria-label="cookie"
            style={{ fontSize: '100px', cursor: 'pointer' }}
            onClick={this.handleClick}
          >
            🍪
          </span>
        </center>
      </div>
    );
  }
}

export default App;
