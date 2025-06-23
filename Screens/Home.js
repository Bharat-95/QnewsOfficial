import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useLanguage } from '../context/languageContext';
import Like from '../components/Like';
import ShareButton from '../components/Share';
import Views from '../components/Views';
import Speak from '../components/Speak';
import { WebView } from 'react-native-webview';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  MobileAds
} from 'react-native-google-mobile-ads';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const { width, height } = Dimensions.get('window');

const interstitialAdUnitId = 'ca-app-pub-5147970592590624/3108591013'; // your real ad unit

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

MobileAds()
  .initialize()
  .then(() => {
    console.log('AdMob initialized');
  });

const stripHtmlTags = html => {
  if (!html || typeof html !== 'string') return ''; // handle undefined/null/non-string

  let text = html.replace(/<\/?[^>]+(>|$)/g, '');
  text = text
    .replace(/\u00a0/g, '')
    .replace(/\&/g, '')
    .replace(/\ /g, '')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'");
  return text;
};

const getLineHeight = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 30 : 28) : lang === 'te' ? 24 : 22);
const getLineHeight1 = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 34 : 30) : lang === 'te' ? 24 : 22);

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

const Home = ({ setShowBottom, setShowHeader }) => {
  const [newsList, setNewsList] = useState([]);
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [greetings, setGreetings] = useState([]);

  const handleTap = () => {
    setShowBottom(prev => {
      const next = !prev;
      if (next) setTimeout(() => setShowBottom(false), 3000);
      return next;
    });
    setShowHeader(prev => {
      const next = !prev;
      if (next) setTimeout(() => setShowHeader(false), 3000);
      return next;
    });
  };

  const scrollCount = useRef(0);
  const lastShownIndex = useRef(-1);

useEffect(() => {
  const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    interstitial.show();
  });

  return () => unsubscribe();
}, []);




  const fetchGreetings = async () => {
    try {
      const res = await axios.get('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/greetings/get');
      const data = res.data?.data || [];
      const validGreetings = data.filter(item => item.createdAt && !isNaN(new Date(item.createdAt)));
      if (data.length !== validGreetings.length) {
        console.log('Invalid createdAt in some greetings:', data.filter(item => !item.createdAt || isNaN(new Date(item.createdAt))));
      }
      setGreetings(validGreetings);
    } catch (error) {
      console.log('Fetch Greetings Error:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn');
      const approved = res.data.data
        .filter(i => i.status === 'Approved')
        .filter(i => i.createdAt && !isNaN(new Date(i.createdAt)))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (res.data.data.length !== approved.length) {
        console.log('Invalid or unapproved news items:', res.data.data.filter(i => !i.createdAt || isNaN(new Date(i.createdAt)) || i.status !== 'Approved'));
      }
      setNewsList(approved);
    } catch (error) {
      console.log('Fetch News Error:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await axios.get('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/video');
      setVideos(res.data?.data || []);
    } catch (error) {
      console.log('Fetch Videos Error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchNews(), fetchVideos(), fetchGreetings()]);
    setRefreshing(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await onRefresh();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const combinedList = useMemo(() => {
  const allItems = [...newsList, ...greetings]
    .filter(item => item.createdAt && !isNaN(new Date(item.createdAt)))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 100); // 👈 Now we limit AFTER sorting all news + greetings

  const list = [];
  let videoIndex = 0;

  for (let i = 0; i < allItems.length; i++) {
    list.push(allItems[i]);

    if ((i + 1) % 5 === 0 && videoIndex < videos.length) {
      list.push({ type: 'video', ...videos[videoIndex++] });
    }
  }

  return list;
}, [newsList, greetings, videos]);


  useEffect(() => {
    console.log('Combined List First 3 Items:', combinedList.slice(0, 3));
  }, [combinedList]);

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

    if (item.type === 'video') {
      const isPlaying = playingVideoId === item.videoId;
      console.log('Video Item:', { videoId: item.videoId, isPlaying });
      return (
        <Animated.View style={[styles.page, { opacity }]}>
          <View style={styles.videoContainer}>
            {isPlaying ? (
              <WebView
                key={item.videoId}
                style={styles.video}
                source={{ uri: `https://www.youtube.com/embed/${item.videoId}?autoplay=1&playsinline=1` }}
                javaScriptEnabled
                domStorageEnabled
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                useWebKit={Platform.OS === 'ios'}
                androidHardwareAcceleration={Platform.OS === 'android'}
                scalesPageToFit={true}
                setBuiltInZoomControls={false}
                onError={e => console.log('WebView Error:', e)}
                onMessage={e => console.log('WebView Message:', e.nativeEvent.data)}
                onLoad={() => console.log('WebView Loaded:', item.videoId)}
                onLayout={e => console.log('WebView Layout:', e.nativeEvent.layout)}
              />
            ) : (
              <TouchableOpacity
                style={styles.thumbnailContainer}
                onPress={() => {
                  console.log('Play button pressed for videoId:', item.videoId);
                  setPlayingVideoId(item.videoId);
                }}
              >
                {item.videoId ? (
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
                    style={styles.thumbnail}
                    resizeMode="contain"
                    onError={e => console.log('Thumbnail Error:', e)}
                  />
                ) : (
                  <View style={[styles.thumbnail, { backgroundColor: '#eee' }]}>
                    <Text style={styles.errorText}>Invalid Video ID</Text>
                  </View>
                )}
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.videoDescriptionContainer}>
            <Text style={styles.videoTitle}>{item.title || 'No Title'}</Text>
            <ScrollView contentContainerStyle={styles.videoDescriptionContent}>
              <Text style={styles.videoDescription}>
                {item.description || 'No description available.'}
              </Text>
            </ScrollView>
          </View>
        </Animated.View>
      );
    }

  

    if (item.greetingId) {
      return (
        <View style={[styles.page, { padding: 0 }]}>
          {item.mediaType === 'image' ? (
            <Image
              source={{ uri: item.fileUrl }}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          ) : (
            <WebView
              source={{ uri: item.fileUrl }}
              style={{ width: '100%', height: '100%' }}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback
            />
          )}
        </View>
      );
    }

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
     onMomentumScrollEnd={({ nativeEvent }) => {
  const index = Math.round(nativeEvent.contentOffset.y / height);
  if (index !== 0 && index % 10 === 0 && index !== lastShownIndex.current) {
    lastShownIndex.current = index;
    console.log('Showing interstitial at:', index);
    interstitial.load();
  }
}}

        ref={flatListRef}
        data={combinedList}
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

export default Home;

// Styles remain unchanged
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
  videoContainer: {
    width,
    height: height * 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  video: {
    width,
    height: height * 0.5,
    minWidth: width,
    minHeight: height * 0.5,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'red',
  },
  thumbnailContainer: {
    width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnail: {
    width,
    height: height * 0.5,
  },
  playButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  videoDescriptionContainer: {
    width,
    height: height * 0.5,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  videoDescriptionContent: {
    paddingBottom: 20,
  },
  videoTitle: {
    fontSize: 16,
    color: '#E2670A',
    marginBottom: 10,
  },
  videoDescription: {
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});