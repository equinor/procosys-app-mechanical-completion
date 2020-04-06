import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import propTypes from 'prop-types';

class IconWithBadge extends React.PureComponent {
  render() {
    const {
      name,
      badgeCount,
      color = '#FFF',
      size = 20,
      title = ''
    } = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Icon name={name} size={size} color={color} />
          {badgeCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -20,
                top: -4,
                backgroundColor: '#FF1243',
                borderRadius: 10,
                width: 26,
                height: 17,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>
                {badgeCount}
              </Text>
            </View>
          )}
        </View>
        {title.length > 0 && <Text style={{ fontSize: 14 }}>{title}</Text>}
      </View>
    );
  }
}

IconWithBadge.propTypes = {
  badgeCount: propTypes.number,
  name: propTypes.string.isRequired,
  size: propTypes.number,
  color: propTypes.string,
  title: propTypes.string
};

export default IconWithBadge;
