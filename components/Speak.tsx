import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioPlayer = new AudioRecorderPlayer();

interface SpeakProps {
  newsText: string;
  language: 'te' | 'en'; 
}

const Speak: React.FC<SpeakProps> = ({ newsText, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isPlayingRef = useRef(false);

  const cleanText = (text: string): string => {
    return text
      .replace(/[^\w\s\u0C00-\u0C7F.,:?]/g, '')
      .replace(/\./g, '.<break time="300ms"/>')
      .replace(/\,/g, ',<break time="200ms"/>')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stopText = async () => {
    try {
      await audioPlayer.stopPlayer();
    } catch (err) {
      console.warn('Nothing to stop:', err);
    }
    setIsSpeaking(false);
    isPlayingRef.current = false;
  };

  const speakText = async () => {
    const apiKey = 'AIzaSyCcO1v8IBFD3vLnDLBh7SR_hCkP7qD9isI';
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
    const ssmlText = `<speak>${cleanText(newsText)}</speak>`;

    const voice =
      language === 'te'
        ? {
            languageCode: 'te-IN',
            ssmlGender: 'MALE',
            name: 'te-IN-Standard-A',
          }
        : {
            languageCode: 'en-IN',
            ssmlGender: 'MALE',
            name: 'en-IN-Wavenet-B',
          };

    const data = {
      input: { ssml: ssmlText },
      voice,
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    try {
      setIsSpeaking(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('API response:', result);

      if (result.audioContent) {
        console.log('✅ Audio generated with:', voice.name);
        const filePath = `${RNFS.DocumentDirectoryPath}/speech.mp3`;
        await RNFS.writeFile(filePath, result.audioContent, 'base64');

        await audioPlayer.startPlayer(`file://${filePath}`);
        isPlayingRef.current = true;

        audioPlayer.addPlayBackListener((e) => {
          if (e.currentPosition >= e.duration) {
            audioPlayer.stopPlayer();
            setIsSpeaking(false);
            isPlayingRef.current = false;
          }
        });
      } else {
        console.error('No audioContent returned:', result);
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('TTS API Error:', err);
      setIsSpeaking(false);
    }
  };


  useEffect(() => {
    stopText();

    return () => {
      stopText();
    };
  }, [newsText]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isSpeaking ? stopText : speakText}
        disabled={!newsText}
      >
        <Icon
          name={isSpeaking ? 'volume-off' : 'volume-up'}
          size={30}
          color={isSpeaking ? 'red' : '#dd6b20'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Speak;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
