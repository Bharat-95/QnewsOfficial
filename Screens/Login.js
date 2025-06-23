import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/languageContext';
import axios from 'axios';

const Login = ({ navigation }) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.replace('Home');
        }
      } catch (err) {
        console.error('Error checking token:', err);
      }
    };
    checkToken();
  }, [navigation]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill out all fields');
      return;
    }

    if (!isChecked) {
      setError('Please accept the Terms and Conditions');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/auth/signin',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('email', data.user.email);
        await AsyncStorage.setItem('role', data.user.role);
        await AsyncStorage.setItem('firstName', data.user.firstName);
        await AsyncStorage.setItem('lastName', data.user.lastName);
        navigation.replace('Home');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response && err.response.data && err.response.data.message) {
  const backendMessage = err.response.data.message;

  if (backendMessage.toLowerCase().includes('user not found')) {
    setError('User not found. Please register.');
  } else if (backendMessage.toLowerCase().includes('invalid password')) {
    setError('Password is incorrect.');
  } else {
    setError(backendMessage);
  }
} else {
  setError('Network error. Please try again.');
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SafeAreaView />
          <Text style={styles.logo}>Login</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={[styles.checkbox, isChecked && styles.checkboxChecked]}
              >
                {isChecked && <Text style={styles.checkboxCheckmark}>✔</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate('TermsAndConditions')}
                >
                  Terms and Conditions
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text>
              Don’t have an account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  loginButton: {
    backgroundColor: '#d97706',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpContainer: {
    marginTop: 20,
  },
});