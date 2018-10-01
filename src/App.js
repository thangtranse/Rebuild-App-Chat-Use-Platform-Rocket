import React from 'react';
import './asset/css/style.css';
import _ from 'lodash';
import firebase from "firebase";
import NewComponentLeft from './components/left';
import NewComponentRight from './components/right';
import NewComponentChat from './components/chat';

import Login from './components/Login'
import api from './ctrl/useApi'
var managerCache = require('./ctrl/managerCache');
var useApiRealTime = require('./ctrl/useApiRealTime');
var ddpclient;
const initState = {
    open: true,
    username: "",
    password: "",
    name: "",
    listGroup: [],
    isLogin: false,
    messHistory: null,
    userInChannel: null,
    isConnect: false,
    mobileOpen_left: false,
    mobileOpen_right: false,
    allUser: [],
    status: "online",
    titleHeader: "Ten Lua Chat"
}
class App extends React.Component {
    constructor() {
        super();
        this.state = initState;
        this.inputChange = this.inputChange.bind(this);
        this.getChannel = this.getChannel.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.statusChange = this.statusChange.bind(this);

        ddpclient = new useApiRealTime();
    }

    connectDDP = (callback) => {
        if (!this.state.isConnect) {
            ddpclient.login(sessionStorage.getItem("authToken"), (err, result) => {
                if (err) {
                    console.log("Login Realtime Fail ", err);
                } else {
                    console.log("Realtime Direct running ", result);
                }
            });
            this.setState({ isConnect: true })
            ddpclient.subscribeNotifyUser(sessionStorage.getItem("userId"));
            ddpclient.listen((resp) => {
                let temp = JSON.parse(resp)
                console.log(temp)
                return callback(temp)
            });
        }
    }

    handleDrawerToggle_left = () => {
        this.setState(state => ({ mobileOpen_left: !state.mobileOpen_left }));
    };
    handleDrawerToggle_right = () => {
        this.setState(state => ({ mobileOpen_right: !state.mobileOpen_right }));
    };

    // Nhận username password
    inputChange(event) {
        console.log(event.target.id)
        this.setState({
            username: event.target.id === 'username' ? event.target.value : this.state.username,
            password: event.target.id === 'password' ? event.target.value : this.state.password
        });
    }

    /**
     * Thực hiện đăng ký kết nối Socket với server
     */
    login = (e) => {
        console.log("start login")
        api.login(document.getElementById("username").value, document.getElementById("password").value, response => {
            sessionStorage.setItem('authToken', response.data.data.authToken);
            sessionStorage.setItem('userId', response.data.data.userId);
            sessionStorage.setItem('username', response.data.data.me.username);
            sessionStorage.setItem('name', response.data.data.me.name);
            this.setState({
                open: false,
                name: response.data.data.me.name,
                isLogin: true
            });
            this.getRoom();
            console.log("finish login")
        });

        e.preventDefault();
    }

    /**
     * Lấy tất cả danh sách phòng
     */
    getRoom() {
        api.getRoom(request => {
            this.setState({
                listGroup: request
            })
        })
    }

    msgHandle = (resp) => {
        switch (resp.msg) {
            case "changed":
                // Direct
                if (resp.fields.eventName.length > 25) {
                    api.getImHistory(resp.fields.eventName, resp => {
                        this.setState({ messHistory: resp })
                    })
                }
                // Channel
                else {
                    api.getChannelMessHistory(resp.fields.eventName, resp => {
                        this.setState({ messHistory: resp })
                    })
                }
        }
    }

    /**
     * Lấy thông tin phòng (Message...)
     * Đăng ký lắng nghe kênh
     *
     * @param roomId
     */
    getChannel(roomId, roomName) {
        console.log("aaaaa" + roomId, "-", roomName);
        this.setState({
            roomId: roomId,
            titleHeader: roomName,
            idApirealtime: newID,
            messHistory: null
        });
        // Đăng ký Connect
        this.connectDDP(resp => {
            this.msgHandle(resp)
        })

        let newID = ddpclient.subscribelRoom(roomId)

        // Lấy data message
        api.getChannelMessHistory(roomId, resp => {
            this.setState({ messHistory: resp })
        })
        // list user trong room
        api.getUserInChannel(roomId, resp => {
            this.setState({ userInChannel: resp })
        })
    }

    /**
     * Chat đơn
     */
    getDirectRoom = (partnerId, name) => {
        // Đăng ký Connect
        this.connectDDP(resp => {
            this.msgHandle(resp)
        })
        this.setState({
            titleHeader: name
        })

        // tạo phòng chat Direct
        api.createIM(partnerId, resp => {
            this.setState({ roomId: resp.data.room._id })

            let newID = ddpclient.subscribelRoom(resp.data.room._id)
            this.setState({ idApirealtime: newID });

            api.getImHistory(resp.data.room._id, resp => {
                this.setState({ messHistory: resp });
            })
        })
    }

    componentWillMount() {
        if (managerCache.checkSession()) {
            this.setState({
                open: false,
                username: sessionStorage.getItem("username"),
                password: "",
                name: sessionStorage.getItem("name"),
                userId: sessionStorage.getItem("userId"),
                authToken: sessionStorage.getItem("authToken"),
                isLogin: true
            })
            this.getRoom();
        }
    }

    /**
     * Thực hiện upload File
     * Sẽ đẩy lên server Firebase
     * Cấu hình xem ở file Config.json
     * @param event
     */
    uploadFile(event) {
        console.log("vaooooooooooo");
        console.log(event.target.files[0]);
        var file = event.target.files[0];
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child(`images/${file.name}`).put(event.target.files[0]);
        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, function () {
            console.log("Upload File Error");
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                // ddpclient.sendingFile(file.name, file.size, file.type, 'GENERAL', downloadURL, downloadURL);
                api.sendMess(this.state.roomId, downloadURL, resp => {
                    console.log("upload thành công", resp)
                    document.getElementById("textarea").value = ''
                })
            });
        });
    }

    /**
     * bla bla
     */
    testFunction() {
        ddpclient.subscribeNotifyRoom('GENERAL', sessionStorage.getItem("username"));
    }

    statusChange(status) {
        this.connectDDP(() => { })
        ddpclient.changeStatus(
            status,
            (...args) => {
                console.log(args);
                this.setState({ status });
            },
        )
    }
    render() {
        if (this.state.isLogin) {
            return (
                <div className="clearfix">
                    <NewComponentLeft
                        listgroup={this.state.listGroup}
                        getChannel={this.getChannel}
                        infor={this.state} status={this.state.status} onStatusChange={this.statusChange}
                    />
                    <NewComponentChat
                        uploadFile={this.uploadFile}
                        titleHeader={this.state.titleHeader}
                        rid={this.state.roomId}
                        messHistory={this.state.messHistory}
                    />
                    // test
                    <NewComponentRight userInChannel={this.state.userInChannel}
                        allUser={this.state.allUser}
                        getDirectRoom={this.getDirectRoom} />
                </div>
            )
        }
        else {
            return (
                <Login open={this.state.open}
                    onChange={this.inputChange}
                    onLogin={this.login}
                />
            )
        }
    };
}
export default App;