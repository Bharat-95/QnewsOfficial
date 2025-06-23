import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome'
import {useNavigation} from '@react-navigation/native';

const Bottom = () => {
   const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Trending')}>
        <Icon name="trending-up" size={30} color="#E2670A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={30} color="#E2670A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Paper')}>
        <Icon1 name="newspaper-o" size={30} color="#E2670A" />
      </TouchableOpacity>
    </View>
  );
};

export default Bottom;

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
