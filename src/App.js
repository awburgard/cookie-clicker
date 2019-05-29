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
  }

  componentDidMount() {
    this.getCount();
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

  handleChange = (event) => {
    if (event.target.dataset.name === 'username') {
      this.setState({
        username: event.target.value
      })
    }
  };

  handleClick = () => {
    const newCount = Number(this.state.clickCount) + 1;
    document.cookie = `count=${newCount}`;
    this.setState({
      clickCount: newCount,
    });
  }

  editUsername = () => {
    this.setState({
      usernameIsEditable: true,
    });
  }

  saveUsername = () => {
    const newUser = String(this.state.username);
    document.cookie = `username=${newUser}`;
    this.setState({
      usernameIsEditable: false,
    });
  }

  render() {
    let inputToShow;
    if (this.state.usernameIsEditable) {
      inputToShow = <input onChange={this.handleChange} type="text" placeholder="Username" value={this.state.username} data-name="username" />
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
              <button onClick={this.editUsername}>Edit Username</button>
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
