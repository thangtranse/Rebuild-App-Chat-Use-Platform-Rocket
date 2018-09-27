import React, {Component} from 'react';
import EmojiPicker from 'emoji-picker-react';
import JSEMOJI from 'emoji-js';

// new instance
var jsemoji = new JSEMOJI();
// set the style to emojione (default - apple)
jsemoji.img_set = 'emojione';
// set the storage location for all emojis
jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';
jsemoji.use_sheet = false;
// jsemoji.supports_css = false;
jsemoji.allow_native = true;
jsemoji.replace_mode = 'unified';

class Emoji extends Component {
    handleClickEmoji = (code,emoji)=>{
        console.log(emoji);
        let emojiPic = jsemoji.replace_colons(`:${emoji.name}:`);
        console.log(emojiPic);
        this.props.onEmojiClick(emojiPic);
    }
    render() {
        return (
            <EmojiPicker onEmojiClick={this.handleClickEmoji} />
        );
    }
}
export default Emoji;