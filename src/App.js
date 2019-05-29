import React, { Component } from 'react';

const getCookie = (cookieName) => {
  // Get name followed by anything except a semicolon
  const cookieString = RegExp('' + cookieName + '[^;]+').exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookieString ? cookieString.toString().replace(/^[^=]+./, '') : '');
}

const getUserName = (userName) => {
  const usernameString = RegExp('' + userName + '[^;]+').exec(document.cookie);
  return decodeURIComponent(!!usernameString ? usernameString.toString().replace(/^[^=]+./, '') : '');
}

class App extends Component {
  state = {
    clickCount: getCookie('count') || 0,
    usernameIsEditable: false,
    username: getUserName('username') || '',
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
    document.cookie=`username=${newUser}`;
    this.setState({
      usernameIsEditable: false,
    });
  }

  render() {
    let inputToShow;
    if (this.state.usernameIsEditable) {
      inputToShow = <input onChange={this.handleChange} type="text" placeholder="Username" value={this.state.username} data-name="username"/>
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
