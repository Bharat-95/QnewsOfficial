import React, { useRef } from 'react';
import { StyleSheet, View, Text, Image, Alert, Linking, Platform } from 'react-native';
import Share from 'react-native-share';
import ViewShot, { captureRef } from 'react-native-view-shot';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

interface ShareButtonProps {
  newsData: {
    newsId: string;
    headlineTe: string;
    headlineEn: string;
    newsTe: string;
    newsEn: string;
    image: string;
  };
  language: 'te' | 'en';
}

const ShareButton: React.FC<ShareButtonProps> = ({ newsData, language }) => {
  const viewShotRef = useRef<ViewShot>(null);

  const getFirstTwoLines = (text: string): string => {
    const lines = text.replace(/\n/g, ' ').split(/(?<=\.)\s+/).filter(line => line.length > 0);
    return lines.length >= 2 ? `${lines[0]} ${lines[1]}` : lines[0];
  };

  const headline = language === 'te' ? newsData.headlineTe : newsData.headlineEn;
  let newsText = language === 'te' ? newsData.newsTe : newsData.newsEn;

  if (!headline || !newsText) {
    console.error('Error: Headline or News Text is missing.');
    Alert.alert('Error', 'Missing headline or news text');
    return null;
  }

  const stripHtmlTags = (html: string): string => {
    return html
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  newsText = stripHtmlTags(newsText);
  const twoLinesOfNews = getFirstTwoLines(newsText);

  const shareContent = async () => {
  try {
    if (!viewShotRef.current) {
      Alert.alert('Error', 'Screenshot capture failed');
      return;
    }

    const imageUri = await captureRef(viewShotRef.current, {
      format: 'jpg',
      quality: 0.9,
      result: 'tmpfile', // Use tmpfile for iOS compatibility
    });

    if (!imageUri) {
      Alert.alert('Error', 'Failed to generate image');
      return;
    }

    const deepLink = `qnews://${newsData.newsId}`;
    const webLink = `https://www.qgroupmedia.com/news/${newsData.newsId}?language=${language}`;
    const androidDeepLink = `intent://${newsData.newsId}?language=${language}#Intent;scheme=qnews;package=com.qnews.app;end;`;

    const supported = await Linking.canOpenURL(deepLink);
    const finalLink =
      Platform.OS === 'android'
        ? supported ? androidDeepLink : webLink
        : supported ? deepLink : webLink;

    const shareMessage = `👉 Click below to read:\n${webLink}`;

    const shareOptions = {
      title: 'Share News',
      message: shareMessage,
      url: imageUri,
      type: 'image/jpeg',
    };

    await Share.open(shareOptions);
  } catch (error) {
   
  }
};


  return (
    <>
      {/* 🔹 Hidden View to Capture */}
      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={{ position: 'absolute', left: -9999 }}>
        <View style={styles.shareContainer}>
          <Image source={{ uri: newsData.image }} style={styles.newsImage} />
          <Image source={require('../assets/Logo.png')} style={styles.logo} />
          <Text style={[
            styles.headline,
            { fontFamily: language === 'te' ? 'Ramaraja' : 'Poppins-SemiBold' }
          ]}>
            {headline}
          </Text>
          <Text style={[
            styles.newsText,
            { fontFamily: language === 'te' ? 'Mandali' : 'Poppins-Regular' }
          ]}>
            {twoLinesOfNews}
          </Text>
        </View>
      </ViewShot>

      {/* 🔹 Visible Share Button */}
      <View style={styles.buttonContainer}>
        <IconFontAwesome name="share" size={24} color="#dd6b20" onPress={shareContent} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  shareContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  newsImage: {
    width: 280,
    height: 180,
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 40,
    marginTop: 10,
    resizeMode: 'contain',
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  newsText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: '#555',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default ShareButton;
