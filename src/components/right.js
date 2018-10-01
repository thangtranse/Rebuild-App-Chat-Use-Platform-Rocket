import React from 'react';
import '../asset/css/style.css';
import api from '../ctrl/useApi';
import _ from "lodash";

class NewComponentRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allUser: [],
            userInChannel: [],
            isAllUser: true,
            filterName: ''
        };
        this.fetchInterval = null; //Fetch user interval
    }
    componentDidMount() {
        this.showAllUser();
    }
    showAllUser() {
        const fetch = () =>
            api.getAllUser(response => {
                // console.log(response.data.users);
                this.setState({ allUser: response.data.users });
            });
        fetch();
        this.fetchInterval = setInterval(fetch, 5000);
    }
    handleChange = (event, value) => {
        if (value === "all") {
            this.setState({ isAllUser: true });
            this.showAllUser();
        } else if (value === "room") {
            this.setState({ isAllUser: false });
            this.showChannelUser();
        }
    }
    handleChangeAll = () => {
        this.setState({ isAllUser: true });
        this.showAllUser();
    }
    handleChangeRoom = () => {
        this.setState({ isAllUser: false });
        this.showChannelUser();
    }
    showChannelUser() {
        this.fetchInterval && clearInterval(this.fetchInterval); //Clear
    }
    onChange =(event)=>{
        var name = event.target.name;
        var value = event.target.value;
        this.setState({
            [name] : value
        })
    }
    render() {
        var data =
            (this.state.isAllUser && (this.state.allUser || [])) ||
            _.get(this.props.userInChannel, "data.members") ||
            [];
        var {filterName,allUser}= this.state;
        if(filterName){
            data = data.filter((user)=>{
                if(user.name){
                    return user.name.toLowerCase().indexOf(filterName) !== -1;
                }
            })
        }
        return (
            <div className="people-list" id="people-list">
                <div className="search">
                    <input
                        type="text"
                        placeholder="search"
                        name="filterName"
                        value={filterName}
                        onChange={this.onChange}
                    />
                    <i className="fa fa-search" />
                </div>
                <div className="btn-group btn-group2">
                    <button type="button" className="btn btn-primary btn-primary2" onClick={this.handleChangeAll}>ALL</button>
                    <button type="button" className="btn btn-primary btn-primary2" onClick={this.handleChangeRoom}>ROOM</button>
                </div>
                <div>
                    <ul className="list list-user">
                        {
                            data.map(user => (
                                <li onClick={() => this.props.getDirectRoom(user._id, user.username)}  key={`section_${user._id}`} className="clearfix glow Hover">
                                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg" alt="avatar" />
                                    <div className="about">
                                        <div className="name">{user.name}</div>
                                        <div className="status">
                                            <i className={"fa fa-circle " + user.status} /> {user.status}
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}
export default NewComponentRight;