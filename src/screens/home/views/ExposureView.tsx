import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';
import {useI18n} from 'locale';
import {Text, Box, ButtonSingleLine} from 'components';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {captureException} from 'shared/log';
import {isRegionCovered} from 'shared/RegionLogic';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const {region} = useStorage();
  const i18n = useI18n();
  const navigation = useNavigation();
  const getGuidanceURL = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return i18n.translate(`RegionalGuidance.${region}.URL`);
    }
    return i18n.translate(`RegionalGuidance.CA.URL`);
  }, [i18n, region]);

  const getGuidanceCTA = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return i18n.translate(`RegionalGuidance.${region}.CTA`);
    }
    return i18n.translate(`RegionalGuidance.CA.CTA`);
  }, [i18n, region]);

  const onActionGuidance = useCallback(() => {
    Linking.openURL(getGuidanceURL()).catch(error => captureException('An error occurred', error));
  }, [getGuidanceURL]);
  const onHowToIsolate = useCallback(() => navigation.navigate('HowToIsolate'), [navigation]);
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  const regionCovered = isRegionCovered(region);

  return (
    <BaseHomeView iconName="hand-caution" testID="exposure">
      <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected.Title')}
      </Text>
      <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body1')}</Text>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate(`Home.ExposureDetected.Title2`)}
      </Text>
      <Text>
        {regionCovered ? (
          <Text>{i18n.translate('Home.ExposureDetected.RegionCovered.Body2')}</Text>
        ) : (
          <>
            <Text>{i18n.translate('Home.ExposureDetected.RegionNotCovered.Body2')}</Text>
            <Text fontWeight="bold">{i18n.translate('Home.ExposureDetected.RegionNotCovered.Body3')}</Text>
          </>
        )}
      </Text>

      <Box alignSelf="stretch" marginTop="l" marginBottom={regionCovered ? 'xxl' : 'm'}>
        <ButtonSingleLine text={getGuidanceCTA()} variant="bigFlatPurple" externalLink onPress={onActionGuidance} />
      </Box>
      {!regionCovered && (
        <Box alignSelf="stretch" marginBottom="m">
          <ButtonSingleLine
            text={i18n.translate(`Home.ExposureDetected.RegionNotCovered.HowToIsolateCTA`)}
            variant="bigFlatDarkGrey"
            onPress={onHowToIsolate}
            internalLink
          />
        </Box>
      )}
    </BaseHomeView>
  );
};
