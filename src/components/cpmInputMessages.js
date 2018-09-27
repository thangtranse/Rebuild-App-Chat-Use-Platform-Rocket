import React from 'react';

import '../asset/css/style.css';
import Emoji from './Emoji'
import api from '../ctrl/useApi'

class cpmInputMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            isDisplayEmoji : false
        };

        this.shift=false
    }

    sendMessage = () => {
        let message = this.state.message;
        if (message !== '') {
            api.sendMess(this.props.rid, message, resp => {
                console.log(resp)
                document.getElementById("textarea").value = ''
                this.setState({message: ''})
            })
        }
    }

    messageInput = (event) => {
        this.setState({message: event.target.value })
    }
    displayEmoji = ()=>{
        this.setState({
            isDisplayEmoji : !this.state.isDisplayEmoji
        })
    }
    handleClickEmoji =(emoPic)=>{
        this.setState({
            message : this.state.message + emoPic
        });
        this.displayEmoji();
    }

    handleKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter') {
            if (!this.shift) {
                event.preventDefault();
                this.sendMessage();
            }
        }
        else if (event.key === 'Shift'){
            this.shift = true;
        }
    }

    handleKeyUp = (event) => {
        if (event.key === 'Shift') {
            this.shift = false;
        }
    }

    render() {
        return (
            <div className="chat-message clearfix">
                <textarea
                    name="message-to-send"
                    // id="message-to-send"
                    id= "textarea"
                    data-emojiable="true"
                    placeholder="Type your message"
                    rows={3}
                    defaultValue={""}
                    value={this.state.message}
                    onChange={this.messageInput}
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                />
                {/*<i className="fa fa-file-o" />&nbsp;&nbsp;&nbsp;*/}
                    {/*<i className="fa fa-file-image-o"/> &nbsp;&nbsp;&nbsp;*/}
                    <i className="em em-angry" onClick={this.displayEmoji}>&nbsp;{this.state.isDisplayEmoji?<Emoji onEmojiClick={this.handleClickEmoji}/>:''}
                    </i>&nbsp;&nbsp;&nbsp;

                <input
                    onChange={this.props.uploadFile}
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    className="hidden"
                />&nbsp;&nbsp;&nbsp;
                <i className="fa fa-file-image-o" onClick={() => document.getElementById('contained-button-file').click()}></i>
                <button onClick={() => this.sendMessage()}>Send</button>
            </div>
        )
    }
}

export default cpmInputMessage;