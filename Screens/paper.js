import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Dimensions, Linking, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

// Paper Component
const Paper = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/paper');
        const data = await response.json();
        const sortedPapers = data.data.sort((a, b) => {
          const dateA = new Date(`${a.year}-${a.month}-${a.date}`);
          const dateB = new Date(`${b.year}-${b.month}-${b.date}`);
          return dateB.getTime() - dateA.getTime(); // Sort descending to show latest first
        });

        setPapers(sortedPapers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching papers:', error);
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handlePaperClick = (paper) => {
    if (paper.fileUrl) {
      Linking.openURL(paper.fileUrl).catch(() =>
        Alert.alert('Error', 'Failed to open the PDF file. Please try again.')
      );
    } else {
      Alert.alert('Error', 'The file URL is missing!');
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading papers...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Papers</Text>
      <FlatList
        data={papers}
        keyExtractor={(item) => item.paperId.toString()} // Assuming 'paperId' is unique for each paper
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.paperCard} onPress={() => handlePaperClick(item)}>
            <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
            <Text style={styles.paperTitle}>{`${item.date} ${item.month} ${item.year}`}</Text>
            <Text style={styles.paperSubtitle}>Click to read/download</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Paper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  paperCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: width,
  },
  paperTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  paperSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  thumbnail: {
    width: width,
    height: height / 2.5,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
});