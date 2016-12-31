import React, {Component} from 'react';
import {mapObjectValues} from '../../src/helpers';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {POSITIONS} from '../../src/constants';
import Notification from '../../src/components/Notification';
import NotificationsContainer from '../../src/components/NotificationsContainer';

// We use these "expected" component to test HTML structure of each components.
// It's easier and faster than testing manually each nodes.
// With this technique, we are 100% sure of the HTML structure of each component.

export class ExpectedNotification extends Component {
  _setHTML(content) {
    return {
      __html: content
    };
  }

  _renderButtons() {
    const {
      className,
      notification: {buttons}
    } = this.props;

    return buttons.map((button) => {
      return (
        <button key={button.name} className={className.button} onClick={button.onClick}>
          <span className={className.buttonText}>
            {button.primary ?
              <b>{button.name}</b> :
              button.name
            }
          </span>
        </button>
      );
    });
  }

  render() {
    const {
      className,
      notification: {title, message, status, dismissible, closeButton, buttons, image, allowHTML}
    } = this.props;
    const isDismissible = (dismissible && buttons.length === 0);

    return (
      <div className={className.wrapper}>
        <div className={`${className.main} ${className.status(status)} ` +
        `${(isDismissible && !closeButton ? className.dismissible : '')} ` +
        `${className.buttons(buttons.length)}`}>
          {image ?
            <div className={className.imageContainer}>
              <span className={className.image} style={{backgroundImage: `url(${image})`}}/>
            </div> :
            <span className={className.icon}/>
          }
          <div className={className.meta}>
            {title ?
              allowHTML ?
                <h4 className={className.title} dangerouslySetInnerHTML={this._setHTML(title)}/> :
                <h4 className={className.title}>{title}</h4> :
              ''}
            {message ?
              allowHTML ?
                <p className={className.message}
                  dangerouslySetInnerHTML={this._setHTML(message)}/> :
                <p className={className.message}>{message}</p> :
              ''}
          </div>
          {isDismissible && closeButton ?
            <div className={className.closeButtonContainer}>
              <span className={className.closeButton}/>
            </div> :
            ''}
          {buttons.length ?
            <div className={className.buttons()}>
              {this._renderButtons()}
            </div> :
            ''}
        </div>
      </div>
    );
  }
}

export class ExpectedNotificationsContainer extends Component {
  _renderNotifications() {
    // get all notifications and default values for notifications
    const {
      position, theme: {notification: {className}}
    } = this.props;
    let {notifications} = this.props;

    // when notifications are displayed at the bottom,
    // we display notifications from bottom to top
    if ([POSITIONS.bottomLeft, POSITIONS.bottomRight].indexOf(position) >= 0) {
      notifications = notifications.reverse();
    }

    return notifications.map((notification) => {
      return (
        <Notification key={notification.id} notification={notification} className={className}/>
      );
    });
  }

  render() {
    const {
      className,
      transition: {name, enterTimeout, leaveTimeout}
    } = this.props.theme.notificationsContainer;
    const {position} = this.props;

    return (
      <div className={`${className.main} ${className.position(position)}`}>
        <TransitionGroup
          transitionName={name}
          transitionEnterTimeout={enterTimeout}
          transitionLeaveTimeout={leaveTimeout}>
          {this._renderNotifications()}
        </TransitionGroup>
      </div>
    );
  }
}

export class ExpectedNotificationsSystem extends Component {
  static defaultProps = {
    notifications: []
  };
  _renderNotificationsContainers() {
    const {notifications, theme} = this.props;
    const positions = mapObjectValues(POSITIONS);
    const containers = [];

    // render all notifications in the same container at the top for small screens
    if (window.innerWidth < theme.smallScreenMin) {
      return (
        <NotificationsContainer key='t' position='t' theme={theme} notifications={notifications}/>
      );
    }

    containers.push(positions.map((position) => {
      const notifs = notifications.filter((notif) => {
        return position === notif.position;
      });
      return (
        <NotificationsContainer key={position} position={position} theme={theme} notifications={notifs}/>
      );
    }));
    return containers;
  }

  render() {
    const {className} = this.props.theme.notificationsSystem;
    return (
      <div className={className}>
        {this._renderNotificationsContainers()}
      </div>
    );
  }
}
