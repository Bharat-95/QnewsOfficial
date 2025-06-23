declare module 'react-native-onesignal' {
    export default class OneSignal {
      static LogLevel: any;
      static Verbose(Verbose: any) {
        throw new Error('Method not implemented.');
      }
      static Debug: any;
      static Notifications: any;
      static User: any;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      static initialize(arg0: string) {
        throw new Error('Method not implemented.');
      }
      static setAppId(appId: string): void;
      static promptForPushNotificationsWithUserResponse(callback: (response: boolean) => void): void;
      static setNotificationWillShowInForegroundHandler(callback: (notification: any) => void): void;
      static setNotificationOpenedHandler(callback: (notification: any) => void): void;
    }
    declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

  }
  