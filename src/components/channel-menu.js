import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';
import AddIcon from 'material-ui-icons/Add';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { selectChannel, toggleChannelsMenu, addChannel, addNotification } from '../actions';
import microsub from '../modules/microsub-api';


const styles = theme => ({
  drawer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    background: theme.palette.shades.dark.background.appBar,
  },
  button: {
    textAlign: 'left',
    color: theme.palette.shades.dark.text.icon,
  },
  highlightedButton: {
    textAlign: 'left',
    color: theme.palette.secondary['500'],
  },
  addButton: {
    textAlign: 'center',
    color: theme.palette.primary['500'],
  },
  addForm: {
    background: theme.palette.shades.light.background.appBar,
  },
});

class ChannelMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newChannelName: '',
      newChannel: false,
    };
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.renderChannelForm = this.renderChannelForm.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    if (this.props.microsubEndpoint) {
      microsub('getChannels')
        .then((channels) => {
          channels.forEach((channel) => {
            this.props.addChannel(channel.name, channel.uid);
          });
        })
        .catch((err) => {
          console.log('Error getting channels');
          console.log(err);
        });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.microsubEndpoint && this.props.microsubEndpoint !== newProps.microsubEndpoint) {
      microsub('getChannels')
        .then((channels) => {
          channels.forEach((channel) => {
            this.props.addChannel(channel.name, channel.uid);
          });
        })
        .catch((err) => {
          console.log('Error getting channels');
          console.log(err);
        });
    }
  }

  handleClose() {
    if (this.props.open) {
      this.props.toggleChannelsMenu();
    }
  }

  handleAddChannel(e) {
    e.preventDefault();
    microsub('createChannel', { params: [this.state.newChannelName] })
      .then((newChannel) => {
        this.setState({
          newChannelName: '',
          newChannel: false,
        });
        this.props.addChannel(newChannel.name, newChannel.uid);
      })
      .catch((err) => {
        this.props.addNotification('Error creating channel', 'error');
      });
    return false;
  }

  renderChannelForm() {
    if (!this.state.newChannel) {
      return (
        <ListItem
          onClick={() => this.setState({newChannel: true})}
          button
        >
          <ListItemText
            title="Add New Channel"  
            classes={{ text: this.props.classes.addButton }}
            primary={<AddIcon />}
          />
        </ListItem>
      );
    }
    return (
      <form
        className={this.props.classes.addForm}
        onSubmit={this.handleAddChannel}
      >
        <TextField
          fullWidth={true}
          label="New Channel Name"
          required={true}
          autoFocus={true}
          value={this.state.newChannelName}
          onChange={(e) => this.setState({newChannelName: e.target.value})}
        />
        <Button style={{width: '100%'}} type="submit">Add Channel</Button>
      </form>
    );
  }

  render() {
    return (
      <div className={this.props.classes.drawer}>
        <List>
          {this.props.channels.map((channel) => {
            let textClassName = this.props.classes.button;
            if (channel.uid === this.props.selectedChannel) {
              textClassName = this.props.classes.highlightedButton;
            }
            return (
              <Link to={`/channel/${channel.uid}`} key={`channel-${channel.uid}`} style={{ textDecoration: 'none' }} onClick={this.handleClose}>
                <ListItem button>
                  <ListItemText
                    classes={{ text: textClassName }}
                    primary={channel.name}
                  />
                </ListItem>
              </Link>
            );
          })}
        </List>
        <div style={{ flexGrow: 1 }}></div>
        {this.renderChannelForm()}
      </div>
    );
  }
}

ChannelMenu.defaultProps = {
  open: false,
};

ChannelMenu.propTypes = {
  channels: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    microsubEndpoint: state.user.get('microsubEndpoint'),
    selectedChannel: state.app.get('selectedChannel'),
    channels: state.channels.toJS(),
    open: state.app.get('channelsMenuOpen'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectChannel: selectChannel,
    toggleChannelsMenu: toggleChannelsMenu,
    addChannel: addChannel,
    addNotification: addNotification,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChannelMenu));
