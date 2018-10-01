import React from "react";
import "../asset/css/style.css";

import TableUser from './cpmTableUserForCreateChannel';
import DropDownMenu from "./view/DropDownMenu";
import STATUS from "../constant/status";
import api from '../ctrl/useApi';

class cpmBoxInfo extends React.Component {
    constructor(props) {
        super(props);
        this.getProp();
        this.state = {
            open: false,
            selected: [],
            channelName: ''
        };
    }

    logout = () => {
        api.logout();
    }

    getProp = () => {
        console.log("thangse 2", this.props.infor);
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    getSelectedUser = (selected) => {
        this.setState({ selected: selected })
    }

    getChannelName = (event) => {
        this.setState({ channelName: event.target.value })
    }

    createChannel = () => {
        let channelName = this.state.channelName
        let listUser = this.state.selected
        api.createChannel(channelName, listUser, resp => {
            console.log(resp)
        })
        this.handleClose()
        this.setState({
            selected: [],
            channelName: ''
        })
    }

    createGroup = () => {
        return (
            <div className="modal fade modal2" id="myModal" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">CREATE GROUP</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group" >
                                <label >Group's Name</label>
                                <input type="text" onChange={this.getChannelName} className="form-control" id="namegroup" />
                            </div>
                        </div>
                        <TableUser listUser={this.state.listUser} getSelectedUser={this.getSelectedUser} />
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.createChannel}>Create</button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    render() {
        const statusItems = Object.keys(STATUS)
            .filter(status => status !== "offline")
            .map(status => {
                return {
                    value: (
                        <React.Fragment>
                            <div className="status">
                                <i className={"fa fa-circle " + status} /> {status}
                            </div>
                        </React.Fragment>
                    ),
                    onClick: () => {
                        this.props.onStatusChange(status)
                    }
                };
            });

        return (
            <div>
                <div className="infor">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_03.jpg" alt="avatar" />
                    <div className="about">
                        <div className="name">{this.props.infor.name}</div>
                        <div className="status">
                            <i className={"fa fa-circle " + this.props.infor.status} />
                            {this.props.infor.status}
                        </div>
                    </div>
                    <DropDownMenu
                        items={[
                            ...statusItems,
                            { value: "PROFILE" },
                            { value: "MY ACCOUNT" },
                            { value: "LOGOUT", onClick: this.logout }
                        ]}
                    />
                </div>
                <div className="box_tmt iconbar_tmt">
                    <a href="#" data-toggle="modal" data-target="#myModal" onClick={this.handleClickOpen}>
                        <span className="glyphicon glyphicon-plus"></span></a>
                    {this.createGroup()}
                </div>
            </div>
        );
    }
}
export default cpmBoxInfo;