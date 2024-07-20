import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './TabNavigation';
import CallNotificationListener from '../CallNotificationListener';


const MainNavigation = () => {
  return (
    <NavigationContainer>
      <CallNotificationListener />
      <TabNavigation />
    </NavigationContainer>
  )
}

export default MainNavigation;
