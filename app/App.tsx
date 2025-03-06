import { SafeAreaView, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import tema from './src/utils/tema';

import Routes from './src/routes/index.routes';
import store from './store';

export default function App() {

    return (
        <NavigationContainer>
            <Provider store={store}>
                <ThemeProvider theme={tema}>
                    <SafeAreaView style={styles.container}>                    
                        <Routes />
                    </SafeAreaView>
                </ThemeProvider>
            </Provider>
            <Toast />
        </NavigationContainer>
    );

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%'
  },
});

registerRootComponent(App);
