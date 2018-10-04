import React from 'react';
import api from '../ctrl/useApi';

const columnData = [
    {id: 'name'},
];
class EnhancedTableHead extends React.Component {

    render() {
        const {onSelectAllClick, numSelected, rowCount} = this.props;

        return (
            <div>
                <div>
                    <input type="checkbox"
                           name="check"
                           indeterminate={numSelected > 0 && numSelected < rowCount}
                           checked={numSelected === rowCount}
                           onChange={onSelectAllClick}
                    />
                </div>
                {columnData.map(column => {
                    return (
                        <div
                            key={column.id}
                        >
                        </div>
                    );
                }, this)}
            </div>
        );
    }
}
class EnhancedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selected: []
        };
        api.getAllUser(response => {
            console.log("tmt", response);
            this.setState({data: response.data.users});
        });
    }

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({selected: state.data.map(user => user.username)}));
            this.props.getSelectedUser(this.state.data.map(user => user.username))
            return;
        }
        this.setState({selected: []});
        this.props.getSelectedUser([])
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        this.setState({selected: newSelected});
        this.props.getSelectedUser(newSelected)
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {data, selected} = this.state;
        return (
            <div>
                <EnhancedTableHead
                    numSelected={selected.length}
                    onSelectAllClick={this.handleSelectAllClick}
                    rowCount={data.length}
                />
                {/*body*/}
                <div className="container">
                    <div className="col-md-4">
                        <form>
                            <h3>Members</h3>
                            <div className="form-check" onClick={event => this.handleSeclectAllClick}>
                                <label>
                                    <input type="checkbox" name="check"/>
                                    <span className="label-text">Select All</span>
                                </label>
                            </div>
                            {
                                data.map(user=>{
                                    const isSelected = this.isSelected(user.username);
                                    return(
                                        <div className="form-check" onClick={event => this.handleClick(event, user.username)}>
                                            <label>
                                                <input type="checkbox" name="check" />
                                                <span className="label-text">{user.username}</span>
                                            </label>
                                        </div>
                                    );
                                })
                            }
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default EnhancedTable;
