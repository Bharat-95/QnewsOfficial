import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons'
import {useNavigation} from '@react-navigation/native';
import {useLanguage} from '../context/languageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const MyAccount = () => {
  const {language, translations} = useLanguage();
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState('Guest');

  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const firstName = await AsyncStorage.getItem('firstName');
        const lastName = await AsyncStorage.getItem('lastName');
        const token = await AsyncStorage.getItem('token');

        if (token && firstName) {
          setUserName(`${firstName} ${lastName || ''}`.trim());
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Failed to get user info from storage', err);
      }
    };
    checkLogin();
  }, []);

  
  const categories = [
    {label: translations.telangana, icon: 'flag', route: 'Home'},
    {label: translations.india, icon: 'flag', route: 'Home'},
    {label: translations.world, icon: 'globe', route: 'Home'},
    {label: translations.politics, icon: 'flag', route: 'Home'},
    {label: translations.business, icon: 'briefcase', route: 'Home'},
    {label: translations.health, icon: 'heart', route: 'Home'},
    {label: translations.sports, icon: 'activity', route: 'Home'},
    {label: translations.film, icon: 'film', route: 'Home'},
    {label: translations.others, icon: 'book', route: 'Home'},
  ];


   const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('firstName');
      await AsyncStorage.removeItem('lastName');
      setIsLoggedIn(false);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };



  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.userSection}>
        <Icon name="user" size={40} color="#E2670A" />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.divider} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('Category', {category: cat.route})}>
            <Icon name={cat.icon} size={16} color="#E2670A" style={styles.icon} />
            <Text style={styles.categoryText}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      {!isLoggedIn ? (
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>{translations.logIn} / {translations.signUp}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.scrollArea}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Terms')}>
  <View style={styles.menuRow}>
    <Icon2 name="document-text-outline" size={24} color="#E2670A" />
    <Text style={styles.menuText}>Terms & Conditions</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
  <View style={styles.menuRow}>
    <Icon1 name="logout" size={24} color="#E2670A" />
    <Text style={styles.menuText}>Logout</Text>
  </View>
</TouchableOpacity>

        </View>
      )}
    </ScrollView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  categoryItem: {
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  icon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  loginBtn: {
    backgroundColor: '#E2670A',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollArea: {
    paddingVertical: 10,
  },
  menuItem: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  logoutBtn: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#E2670A',
    fontWeight: 'bold',
  },
  menuItem: {
  marginBottom: 15,
},

menuRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

menuText: {
  fontSize: 18,
  fontWeight: '600',
  color: '#E2670A',
  marginLeft: 10,
},
});