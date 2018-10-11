import React from "react";

class DropDownMenu extends React.Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { header, items, component: Component } = this.props;

        return (
            <div className="alignCenterHeight_tmt dropdown">
                <a href="#" className="iconSize_tmt" data-toggle="dropdown" onClick={this.handleClick}>
                    <span className="glyphicon glyphicon-menu-hamburger"></span></a>
                <ul className="dropdown_tmt dropdown-menu box_tmt colorText_tmt cursor_tmt">
                    {items.map(item => (
                        <li>
                            <a onClick={() => {
                                this.handleClose();
                                item.onClick && item.onClick();
                            }}>
                                {item.value}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default DropDownMenu;
