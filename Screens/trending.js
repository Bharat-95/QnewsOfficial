import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { useLanguage } from '../context/languageContext';
import { useNavigation } from '@react-navigation/native';
import Like from '../components/Like';
import ShareButton from '../components/Share';
import Views from '../components/Views';
import Speak from '../components/Speak';

const { width, height } = Dimensions.get('window');

const stripHtmlTags = html => {
  let text = html.replace(/<\/?[^>]+(>|$)/g, '');
  text = text
    .replace(/ /g, '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'");
  return text;
};

const getLineHeight = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 30 : 28) : lang === 'te' ? 24 : 22);
const getLineHeight1 = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 34 : 30) : lang === 'te' ? 24 : 22);
const getHeadlineFontSize = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 22 : 18) : lang === 'te' ? 20 : 15);
const getDescriptionFontSize = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 19 : 17) : lang === 'te' ? 16 : 14);

const getFontFamily = (lang, type) => {
  if (lang === 'te') {
    return type === 'headline'
      ? Platform.OS === 'ios' ? 'Ramaraja' : 'Ramaraja-Regular'
      : Platform.OS === 'ios' ? 'Mandali' : 'Mandali-Regular';
  } else {
    return type === 'headline' ? 'Poppins-SemiBold' : 'Poppins-Regular';
  }
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const Trending = ({ setShowBottom, setShowHeader }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleTap = () => {
    console.log('Trending: handleTap triggered'); // Debug
    setShowBottom(prev => {
      const next = !prev;
      console.log('Trending: setShowBottom', next); // Debug
      if (next) setTimeout(() => setShowBottom(false), 3000);
      return next;
    });
    setShowHeader(prev => {
      const next = !prev;
      console.log('Trending: setShowHeader', next); // Debug
      if (next) setTimeout(() => setShowHeader(false), 3000);
      return next;
    });
  };

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn');
      const responseData = response.data.data;
      console.log('Trending: API response', responseData); // Debug
      if (Array.isArray(responseData)) {
        const filteredData = responseData.filter(news => news.status === 'Approved');
        const shuffledData = shuffleArray(filteredData);
        setData(shuffledData);
        console.log('Trending First 3 Items:', shuffledData.slice(0, 3)); // Debug
      } else {
        console.error('Response data is not an array');
        setData([]);
      }
    } catch (error) {
      console.error('Unable to get Data from Database', error);
      setData([]);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [fetchData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    };
    fetchInitialData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    const inputRange = [(index - 1) * height, index * height, (index + 1) * height];
    const opacity = scrollY.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
    const scale = scrollY.interpolate({ inputRange, outputRange: [0.95, 1, 0.95], extrapolate: 'clamp' });

    return (
      <TouchableWithoutFeedback onPress={handleTap}>
        <Animated.View style={[styles.page, { opacity, transform: [{ scale }] }]}>
          <View style={styles.imageWrapper}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.image, { backgroundColor: '#eee' }]} />
            )}
            <Image source={require('../assets/Logo.png')} style={styles.logo} />
          </View>
          <View style={styles.fixedHeadlineContainer}>
            <Text
              style={[
                styles.headline,
                {
                  fontFamily: getFontFamily(language, 'headline'),
                  fontSize: getHeadlineFontSize(language),
                  lineHeight: getLineHeight1(language),
                },
              ]}
              numberOfLines={2}
            >
              {language === 'te' ? item.headlineTe : item.headlineEn}
            </Text>
            <View style={styles.ButtonsContainer}>
              <Like newsId={item.newsId} initialLikes={item.likes} initialLikedBy={item.likedBy} />
              <ShareButton newsData={item} language={language} />
              <Views postUrl={`/news/${item.newsId}`} />
              <Speak
                newsText={language === 'te' ? stripHtmlTags(item.newsTe) : stripHtmlTags(item.newsEn)}
                language={language}
              />
            </View>
          </View>
          <Text style={{ paddingHorizontal: 15, fontSize: 10, fontWeight: '500', paddingBottom: 7 }}>
            {item.employeeId} {'|'} {formatDate(item.createdAt)}
          </Text>
          <ScrollView style={styles.scrollableDescription} contentContainerStyle={styles.descriptionContainer}>
            <Text
              style={[
                styles.description,
                {
                  fontFamily: getFontFamily(language, 'description'),
                  fontSize: getDescriptionFontSize(language),
                  lineHeight: getLineHeight(language),
                },
              ]}
            >
              {stripHtmlTags(language === 'te' ? item.newsTe : item.newsEn)}
            </Text>
          </ScrollView>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.8}
        scrollEventThrottle={16}
        disableIntervalMomentum
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default Trending;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  page: {
    width,
    height,
    backgroundColor: 'white',
  },
  imageWrapper: {
    width: '100%',
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 6,
    resizeMode: 'contain',
  },
  fixedHeadlineContainer: {
    paddingHorizontal: 15,
    paddingTop: 6,
    backgroundColor: 'white',
  },
  headline: {
    color: '#E2670A',
    paddingVertical: 4,
  },
  scrollableDescription: {
    flex: 1,
    backgroundColor: 'white',
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  description: {
    color: '#333',
  },
  ButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: '10%',
    paddingHorizontal: 15,
  },
});