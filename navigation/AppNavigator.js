import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home';
import MyAccount from '../Screens/MyAccount';
import Category from '../Screens/categories/[categories]'
import Login from '../Screens/Login'
import SignUp from '../Screens/SignUp'
import Paper from '../Screens/paper';
import Trending from '../Screens/trending';
import Terms from '../Screens/Terms';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ setShowBottom, setShowHeader }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home">
      {props => <Home {...props} setShowBottom={setShowBottom} setShowHeader={setShowHeader} />}
    </Stack.Screen>
    <Stack.Screen name='MyAccount' component={MyAccount}/>
     <Stack.Screen name='Category'>
       {props => <Category {...props} setShowBottom={setShowBottom} setShowHeader={setShowHeader} />}
      </Stack.Screen>
      <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='Paper' component={Paper}/>
          <Stack.Screen name="Trending">
        {props => <Trending {...props} setShowBottom={setShowBottom} setShowHeader={setShowHeader} />}
      </Stack.Screen>
      <Stack.Screen name='Terms' component={Terms}/>
  </Stack.Navigator>
);

export default AppNavigator;
