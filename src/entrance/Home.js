import React from "react";
import ChattingMainContainer from "../Chatting/ChattingMainContainer";
import Authenticate from "../entrance/Authenticate";
import openSocket from "socket.io-client";
import NavBar from "../NavBar/NavBar";

const io = openSocket("http://3.141.165.79:5010");



class Home extends React.Component {
  state = {
    isloggedin: false,
    logginginError: false,
    onlineUsers: 0,
  };


  componentDidMount() {
    io.on("onlineUsers", (onlineUsers, users) => {
      this.setState({ onlineUsers: onlineUsers });
    });
  }

  render() {
    return (
      <div>
        <div>
          {localStorage.getItem("userOnline") ? (
            <div>
              <ChattingMainContainer name={localStorage.getItem("username")} />
              <NavBar />
            </div>
          ) : (
              <div>
                <Authenticate
                  formInformation={(name, password) =>
                    io.emit("NewUser", name, password, (err, pass) => {
                      if (pass) {
                        localStorage.setItem("userOnline", true);
                        localStorage.setItem("username", name);
                        this.setState({
                          isloggedin: true,
                        });
                      } else {
                        this.setState({ logginginError: true });
                      }
                    })
                  }
                  logginginError={this.state.logginginError}
                  onlineUsers={this.state.onlineUsers}
                />
                <NavBar />
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default Home;
