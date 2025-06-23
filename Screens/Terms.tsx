import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useLanguage } from '../context/languageContext';

const TermsAndConditions = () => {
  const { language } = useLanguage();

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>
        {language === 'te' ? 'నిబంధనలు మరియు షరతులు' : 'Terms and Conditions'}
      </Text>

      {/* Introduction */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '1. పరిచయం' : '1. Introduction'}
      </Text>
      <Text style={styles.text}>
        {language === 'te'
          ? 'Q Group Media కి స్వాగతం, ఇది మీ నమ్మదగిన వార్తా వనరు. మా యాప్ ఉపయోగించడం ద్వారా, మీరు ఈ నిబంధనలను అంగీకరిస్తారు. దయచేసి ఉపయోగించేముందు వాటిని శ్రద్ధగా చదవండి.'
          : 'Welcome to Q Group Media, your trusted source for news and updates. By accessing or using our app, you agree to these Terms and Conditions. Please read them carefully before using our services.'}
      </Text>

      {/* Use of Services */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '2. సేవల వినియోగం' : '2. Use of Services'}
      </Text>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          {language === 'te' ? 'మీరు కనీసం 13 సంవత్సరాల వయస్సు కలిగి ఉండాలి.' : 'You must be at least 13 years old to use our services.'}
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          {language === 'te' ? 'చట్టవిరుద్ధమైన లేదా అసత్యమైన ఉద్దేశ్యాలకు ప్లాట్‌ఫారమ్‌ను ఉపయోగించకూడదు.' : 'You agree not to misuse the platform for illegal or unethical purposes.'}
        </Text>
      </View>

      {/* Content Ownership */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '3. కంటెంట్ హక్కులు & కాపీరైట్' : '3. Content Ownership & Copyright'}
      </Text>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          {language === 'te' ? 'Q Group Media లోని అన్ని కంటెంట్ మా స్వంతమైనవి లేదా లైసెన్స్ పొందినవి.' : 'All news articles, images, and videos on Q Group Media are either owned by us or licensed.'}
        </Text>
      </View>

      {/* Privacy & Data Collection */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '4. గోప్యత & డేటా సేకరణ' : '4. Privacy & Data Collection'}
      </Text>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          {language === 'te' ? 'మేము వినియోగదారుల అనుభవాన్ని మెరుగుపరిచేందుకు డేటాను సేకరిస్తాము.' : 'We collect certain data to improve user experience.'}
        </Text>
      </View>

      {/* Third-Party Links */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '5. మూడవ పక్ష లింకులు & ప్రకటనలు' : '5. Third-Party Links & Advertisements'}
      </Text>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          {language === 'te' ? 'మేము మూడవ పక్ష ప్రకటనలను లేదా లింకులను ప్రదర్శించవచ్చు.' : 'Q Group Media may display third-party ads or links.'}
        </Text>
      </View>

      {/* Account Security */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '6. ఖాతా భద్రత' : '6. Account Security'}
      </Text>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>
          {language === 'te' ? 'ఖాతా భద్రత వినియోగదారుల బాధ్యత.' : 'Users are responsible for maintaining the confidentiality of their accounts.'}
        </Text>
      </View>

      {/* Contact Us */}
      <Text style={styles.sectionTitle}>
        {language === 'te' ? '7. మమ్మల్ని సంప్రదించండి' : '7. Contact Us'}
      </Text>
      <Text style={styles.text}>
        {language === 'te'
          ? 'మాకు ఏవైనా ప్రశ్నలు ఉంటే, మమ్మల్ని సంప్రదించండి:\n📧 support@qgroupmedia.com\n📍 1-89/4, రాఘవేంద్ర నగర్ కాలనీ, భగ్య నగర్ కాలనీ, బోడుప్పల్, హైదరాబాద్, తెలంగాణ 500092'
          : 'If you have any questions about these Terms and Conditions, please contact us at:\n📧 support@qgroupmedia.com\n📍 1-89/4, Raghavendra Nagar Colony, Bhagya Nagar Colony, Boduppal, Hyderabad, Telangana 500092'}
      </Text>
    </ScrollView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#d97706',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#d97706',
    textAlign: 'left',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    textAlign: 'left',
    marginBottom: 15, // Increased margin for better spacing
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8, // Adjusted spacing for bullets
  },
  bullet: {
    fontSize: 16,
    color: '#d97706',
    marginRight: 5,
  },
  bulletText: {
    fontSize: 14,
    color: '#333',
    flex: 1, // Ensures proper text wrapping
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    color: '#555',
  },
});
