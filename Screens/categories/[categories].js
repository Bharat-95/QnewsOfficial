import React, {useEffect, useState, useRef} from 'react';
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
} from 'react-native';
import axios from 'axios';
import {useLanguage} from '../../context/languageContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import Like from '../../components/Like';
import ShareButton from '../../components/Share';
import Views from '../../components/Views';
import Speak from '../../components/Speak';

const {width, height} = Dimensions.get('window');

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


const formatDate = dateString => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return date.toLocaleDateString('en-GB', options);
};

const getLineHeight = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 30 : 28) : lang === 'te' ? 24 : 22);

const getFontFamily = (lang, type) => {
  if (lang === 'te') {
    return type === 'headline'
      ? Platform.OS === 'ios' ? 'Ramaraja' : 'Ramaraja-Regular'
      : Platform.OS === 'ios' ? 'Mandali' : 'Mandali-Regular';
  } else {
    return type === 'headline' ? 'Poppins-SemiBold' : 'Poppins-Regular';
  }
};

const getHeadlineFontSize = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 24 : 18) : lang === 'te' ? 20 : 15);
const getDescriptionFontSize = lang => (Platform.OS === 'ios' ? (lang === 'te' ? 20 : 17) : lang === 'te' ? 16 : 14);

const Category = ({setShowBottom, setShowHeader}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {category} = route.params;
  const [newsList, setNewsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const {language} = useLanguage();

  const handleTap = () => {
    setShowBottom?.(prev => {
      const next = !prev;
      if (next) setTimeout(() => setShowBottom(false), 3000);
      return next;
    });

    setShowHeader?.(prev => {
      const next = !prev;
      if (next) setTimeout(() => setShowHeader(false), 3000);
      return next;
    });
  };

  const fetchNews = () => {
    setRefreshing(true);
    axios
      .get('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn')
      .then(res => {
        const approved = res.data.data
          .filter(i => i.status === 'Approved' && i.category === category)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNewsList(approved);
      })
      .catch(err => console.error('Error fetching news:', err))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const renderItem = ({item, index}) => {
    const inputRange = [
      (index - 1) * height,
      index * height,
      (index + 1) * height,
    ];

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.95, 1, 0.95],
      extrapolate: 'clamp',
    });

    return (
      <TouchableWithoutFeedback onPress={handleTap}>
        <Animated.View style={[styles.page, {opacity, transform: [{scale}]}]}>
          <View style={styles.imageWrapper}>
            {item.image ? (
              <Image source={{uri: item.image}} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.image, {backgroundColor: '#eee'}]} />
            )}
            <Image source={require('../../assets/Logo.png')} style={styles.logo} />
          </View>

          <View style={styles.fixedHeadlineContainer}>
            <Text    style={[
                styles.headline,
                {
                  fontFamily: getFontFamily(language, 'headline'),
                  fontSize: getHeadlineFontSize(language),
                },
              ]}>
              {language === 'te' ? item.headlineTe : item.headlineEn}
            </Text>
          </View>

          <Text style={styles.reporterText}>
            {item.employeeId} | {formatDate(item.createdAt)}
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
              ]}>
              {stripHtmlTags(language === 'te' ? item.newsTe : item.newsEn)}
            </Text>
          </ScrollView>

          <View style={styles.ButtonsContainer}>
            <Like newsId={item.newsId} initialLikes={item.likes} initialLikedBy={item.likedBy} />
            <ShareButton newsData={item} language={language} />
            <Views postUrl={`https://www.qgroupmedia.com/news/${item.newsId}`} />
            <Speak
              newsText={stripHtmlTags(language === 'te' ? item.newsTe : item.newsEn)}
              language={language === 'te' ? 'te-IN' : 'en-IN'}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Animated.FlatList
        data={newsList}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.8}
        scrollEventThrottle={16}
        disableIntervalMomentum
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        getItemLayout={(_, index) => ({length: height, offset: height * index, index})}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNews} />}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  page: {width, height, backgroundColor: 'white'},
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
    fontSize: 20,
  },
  reporterText: {
    paddingHorizontal: 15,
    fontSize: 10,
    fontWeight: '500',
    paddingBottom: 7,
  },
  scrollableDescription: {
    flex: 1,
    backgroundColor: 'white',
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  ButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: '10%',
    paddingHorizontal: 15,
  },
});
