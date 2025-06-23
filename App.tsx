import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import Header from './components/Header';
import AppNavigator from './navigation/AppNavigator';
import Bottom from './components/Bottom';
import { NavigationContainer } from '@react-navigation/native';
import LanguageProvider from './context/languageContext';
import {OneSignal, LogLevel} from 'react-native-onesignal';


const App = () => {
  const [showBottom, setShowBottom] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

    useEffect(() => {
    // Initialize OneSignal
    OneSignal.Debug.setLogLevel(LogLevel.Verbose); // Enable logging for debugging
    OneSignal.initialize('dc0dc5b0-259d-4e15-a368-cabe512df1b8'); // Replace with your OneSignal App ID

    // Request notification permission
    OneSignal.Notifications.requestPermission(true)
      .then((granted: any) => {
        if (granted) {
          console.log('Notification permission granted.');
          sendTokenToBackend(); // Send token only if permission is granted
        } else {
          console.log('Notification permission denied.');
        }
      })
      .catch((error: any) => {
        console.error('Error requesting notification permission:', error);
      });


    // Handle notification clicks
    OneSignal.Notifications.addEventListener('click', (event: any) => {
      console.log('Notification clicked:', event);
    });

    return () => {
      // Cleanup listeners
      OneSignal.Notifications.removeEventListener('click');
    };
  }, []);

  const sendTokenToBackend = async () => {
    try {
      const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
      const pushToken = await OneSignal.User.pushSubscription.getTokenAsync();

      if (subscriptionId && pushToken) {
        console.log('Push Subscription ID:', subscriptionId);
        console.log('Push Token:', pushToken);

        const response = await fetch(
          'https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/token/register-token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({subscriptionId, pushToken}),
          },
        );

        if (response.ok) {
          console.log('Token registered successfully:', await response.json());
        } else {
          console.error(
            'Failed to register token:',
            response.status,
            response.statusText,
          );
        }
      } else {
        console.warn('Push Subscription ID or Token is missing.');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };


  return (
    <LanguageProvider>
      {/* Force white background color for StatusBar */}
      <StatusBar
        translucent={false}
        backgroundColor="white"
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          {showHeader && <Header />}
          <AppNavigator setShowBottom={setShowBottom} setShowHeader={setShowHeader} />
          {showBottom && <Bottom />}
        </NavigationContainer>
      </SafeAreaView>
    </LanguageProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
