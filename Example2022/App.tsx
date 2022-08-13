/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  DeviceEventEmitter,
  PermissionsAndroid,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Kontakt from 'react-native-kontaktio';
import type {ColorValue} from 'react-native';
import type {
  ConfigType,
  RegionType,
  IBeaconAndroid,
} from 'react-native-kontaktio';

const {
  connect,
  configure,
  disconnect,
  isConnected,
  startScanning,
  stopScanning,
  restartScanning,
  isScanning,
  // setBeaconRegion,
  setBeaconRegions,
  getBeaconRegions,
  setEddystoneNamespace,
  IBEACON,
  EDDYSTONE,
  // Configurations
  scanMode,
  scanPeriod,
  activityCheckConfiguration,
  forceScanConfiguration,
  monitoringEnabled,
  monitoringSyncInterval,
} = Kontakt;

const region1: RegionType = {
  identifier: 'My-Region',
  uuid: '75b56cb8-04b0-438f-83d0-c15194766fce',
  //major: 1,
  // no minor provided: will detect all minors
};

type State = {
  scanning: boolean;
  beacons: Array<IBeaconAndroid>;
  eddystones: Array<IBeaconAndroid>;
  statusText: string | null;
};

import Example from './Example';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    (async () => {
      const config: ConfigType = {
        scanMode: scanMode.BALANCED,
        scanPeriod: scanPeriod.create({
          activePeriod: 6000,
          passivePeriod: 20000,
        }),
        //scanPeriod: scanPeriod.RANGING,
        activityCheckConfiguration: activityCheckConfiguration.DEFAULT,
        forceScanConfiguration: forceScanConfiguration.create({
          forceScanActivePeriod: 5000,
          forceScanPassivePeriod: 5000,
        }),
        monitoringEnabled: monitoringEnabled.TRUE,
        monitoringSyncInterval: monitoringSyncInterval.DEFAULT,
      };

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This example app needs to access your location in order to use bluetooth beacons.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );

      DeviceEventEmitter.addListener('beaconInitStatus', ({isReady}) => {
        console.log(isReady);
        console.log('redy');
      });

      // Region listeners
      DeviceEventEmitter.addListener('regionDidEnter', ({region}) => {
        console.log('regionDidEnter', region);
      });
      DeviceEventEmitter.addListener('regionDidExit', ({region}) => {
        console.log('regionDidExit', region);
      });

      // Beacon monitoring listener
      DeviceEventEmitter.addListener('monitoringCycle', ({status}) => {
        console.log('monitoringCycle', status);
      });

      DeviceEventEmitter.addListener(
        'beaconsDidUpdate',
        ({
          beacons: updatedBeacons,
          region,
        }: {
          beacons: Array<IBeaconAndroid>;
          region: RegionType;
        }) => {
          console.log('beaconsDidUpdate', updatedBeacons, region);
        },
      );

      try {
        console.log('connecting');
        await connect();
        await configure(config);
        await setBeaconRegions([region1]);
        let regions = await getBeaconRegions();
        console.log(regions);
        await startScanning();
      } catch (e) {
        console.log('failed');
      }
    })();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
