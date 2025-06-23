import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconEvil from 'react-native-vector-icons/EvilIcons';

type LikeProps = {
  newsId: string;
  initialLikes: number;
  initialLikedBy: string[];
};

const Like: React.FC<LikeProps> = ({ newsId, initialLikes, initialLikedBy }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      const userEmail = await AsyncStorage.getItem('email');
      if (userEmail && initialLikedBy.includes(userEmail)) {
        setHasLiked(true);
      }
    };
    checkIfLiked();
  }, [initialLikedBy]);

const handleLike = async () => {
  const userEmail = await AsyncStorage.getItem('email');

  if (!userEmail) {
    Alert.alert('Login Required', 'Please login to like this news.');
    return;
  }

  try {
    const endpoint = hasLiked
      ? `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/unlike`
      : `https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/newsEn/${newsId}/like`;

    await axios.put(endpoint, { userEmail, newsId });

    setLikes(prevLikes => hasLiked ? prevLikes - 1 : prevLikes + 1);
    setHasLiked(prev => !prev);
  } catch (error) {
    console.error('Error liking/unliking:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};


  return (
    <TouchableOpacity onPress={handleLike} style={styles.container}>
      <IconEvil
        name="like"
        size={24}
        color={hasLiked ? '#dd6b20' : 'black'}
      />
      <Text style={styles.likesText}>
        {likes} Likes
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  likesText: {
    fontSize: 10,
    marginLeft: 5,
    color: '#dd6b20',
  },
});

export default Like;
