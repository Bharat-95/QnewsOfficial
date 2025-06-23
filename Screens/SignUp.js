import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useLanguage } from '../context/languageContext';
import { useNavigation } from '@react-navigation/native';



const SignUp = () => {
  const { language } = useLanguage(); // Access language context

  const navigation = useNavigation;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const userRole = 'User';

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      setError(language === 'te' ? 'దయచేసి అన్ని ఫీల్డ్స్ పూరించండి' : 'Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'te' ? 'పాస్‌వర్డ్లు సరిపోలడం లేదు' : 'Passwords do not match');
      return;
    }

    if (!isChecked) {
      setError(language === 'te' ? 'దయచేసి షరతులను అంగీకరించండి' : 'Please accept the Terms and Conditions');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/auth/signup',
        { email, password, firstName, lastName, phoneNumber, role: userRole },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        // Save user details to AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('email', data.user.email);
        await AsyncStorage.setItem('role', data.user.role);
        await AsyncStorage.setItem('firstName', data.user.firstName);
        await AsyncStorage.setItem('lastName', data.user.lastName);

        Alert.alert(language === 'te' ? 'విజయం' : 'Success', language === 'te' ? 'ఖాతా విజయవంతంగా రూపొందించబడింది!' : 'Account Created Successfully!');
        navigation.replace('Home');
      } else {
        setError(language === 'te' ? 'సైన్ అప్ విఫలమైంది. మళ్లీ ప్రయత్నించండి.' : 'SignUp failed. Please try again.');
      }
    } catch (err) {
      console.error('SignUp Error:', err);
      setError(language === 'te' ? 'నెట్‌వర్క్ లోపం. మళ్లీ ప్రయత్నించండి.' : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>{language === 'te' ? 'నమోదు' : 'Sign Up'}</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={language === 'te' ? 'మొదటి పేరు' : 'First Name'}
          placeholderTextColor="#d97706"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder={language === 'te' ? 'చివరి పేరు' : 'Last Name'}
          placeholderTextColor="#d97706"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder={language === 'te' ? 'ఈమెయిల్' : 'Email'}
          placeholderTextColor="#d97706"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder={language === 'te' ? 'ఫోన్ నంబర్' : 'Phone Number'}
          placeholderTextColor="#d97706"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          placeholder={language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
          placeholderTextColor="#d97706"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          placeholder={language === 'te' ? 'పాస్‌వర్డ్‌ను నిర్ధారించండి' : 'Confirm Password'}
          placeholderTextColor="#d97706"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Text style={styles.checkboxCheckmark}>✔</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            {language === 'te' ? 'నేను అంగీకరిస్తున్నాను' : 'I agree to the'}{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('TermsAndConditions')}>
              {language === 'te' ? 'నిబంధనలు మరియు షరతులు' : 'Terms and Conditions'}
            </Text>
          </Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.signUpButton} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signUpButtonText}>{language === 'te' ? 'నమోదు' : 'Sign Up'}</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.loginRedirect}>
        <Text>
          {language === 'te' ? 'ఖాతా కలిగి ఉన్నారా?' : 'Already have an account?'}{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
            {language === 'te' ? 'ప్రవేశించండి' : 'Log In'}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d97706',
  },
  inputContainer: {
    width: '80%',
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#d97706',
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#d97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#d97706',
  },
  checkboxCheckmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  linkText: {
    color: '#d97706',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#d97706',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginRedirect: {
    marginTop: 20,
  },
}); 