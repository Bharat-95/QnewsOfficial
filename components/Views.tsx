import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PostViewCountProps {
  postUrl: string;
}

// Simple hash function to generate a consistent number from a string
const stringToHash = (str: string): number => {
  let hash = 0; // Standard initial value
  for (let i = 0; i < str.length; i++) { // Start from index 0
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate a stable random number between 40 and 100 based on postUrl
const getInitialViewCount = (postUrl: string): number => {
  const hash = stringToHash(postUrl);
  return (hash % 61) + 40; // Map to 40-100 (61 = 100 - 40 + 1)
};

const PostViewCount: React.FC<PostViewCountProps> = ({ postUrl }) => {
  const initialViewCount = getInitialViewCount(postUrl); // Stable random number
  const [viewCount, setViewCount] = useState<number>(initialViewCount);
  const [error, setError] = useState<string | null>(null);

  const siteId = '101474780';
  const siteKey = 'd7ca9b452f12a411';

  useEffect(() => {
    if (!postUrl) {
      console.error('Invalid post URL');
      setError('Post URL is missing or invalid');
      return;
    }

    const fetchViewCount = async () => {
      try {
        const urlTe = `${postUrl}?language=te`;
        const urlEn = `${postUrl}?language=en`;

        const [responseTe, responseEn] = await Promise.all([
          fetch(
            `https://api.clicky.com/api/stats/4?site_id=${siteId}&sitekey=${siteKey}&type=pages&item=${encodeURIComponent(
              urlTe
            )}&date=this-month&output=json`
          ),
          fetch(
            `https://api.clicky.com/api/stats/4?site_id=${siteId}&sitekey=${siteKey}&type=pages&item=${encodeURIComponent(
              urlEn
            )}&date=this-month&output=json`
          ),
        ]);

        const dataTe = responseTe.ok ? await responseTe.json() : null;
        const dataEn = responseEn.ok ? await responseEn.json() : null;

        const viewCountTe = parseInt(dataTe?.[0]?.dates?.[0]?.items?.[0]?.value || '0', 10);
        const viewCountEn = parseInt(dataEn?.[0]?.dates?.[0]?.items?.[0]?.value || '0', 10);

        // Add fetched views to the stable initial view count
        setViewCount(initialViewCount + viewCountTe + viewCountEn);
      } catch (err) {
        console.error('Error fetching view count:', err);
        setError('Failed to fetch view count');
      }
    };

    fetchViewCount();
  }, [postUrl, initialViewCount]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>100</Text> {/* Show 100 on error */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.viewCountNumber}>{viewCount}</Text>
      <Text style={styles.viewLabel}>Views</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCountNumber: {
    fontSize: 12,
    fontWeight: '600', // Corrected to valid value
    color: '#dd6b20',
  },
  viewLabel: {
    fontSize: 10,
    color: '#888',
  },
  loading: {
    fontSize: 10,
    color: '#888',
  },
  errorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default PostViewCount;