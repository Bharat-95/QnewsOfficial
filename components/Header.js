import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {useLanguage} from '../context/languageContext';

const {width} = Dimensions.get('window');

const Header = () => {
  const {toggleLanguage} = useLanguage();
  const navigation = useNavigation();

  const goToMyAccount = () => {
    navigation.navigate('MyAccount');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToMyAccount}>
        <Icon name="menu" size={28} color="#E2670A" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Image source={require('../assets/Logo.png')} style={styles.Logo} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleLanguage}>
        <Image source={require('../assets/icon.png')} style={styles.Icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '5%',
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 999,
  },
  Logo: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  Icon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});
