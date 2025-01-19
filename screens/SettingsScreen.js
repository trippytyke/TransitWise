import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, FlatList, Modal, Button, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../theme.js';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import { aboutAndLegalContent } from '../aboutAndLegal.js';
import Markdown from 'react-native-markdown-display';

const SettingsScreen = () => {
  //Get the app theme
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [isRateUsVisible, setRateUsVisible] = useState(false);
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [isReportProblemVisible, setReportProblemVisible] = useState(false);
  const [isAboutLegalVisible, setAboutLegalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [problem, setProblem] = useState('');

  //Markdown styling for modal
  const markdownStyles = {
    body: {
      color: theme.textColor,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: theme.textColor,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    heading2: {
      color: theme.textColor,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    heading3: {
      color: theme.textColor,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    bullet_list: {
      color: theme.textColor,
      fontSize: 16,
    },
    ordered_list: {
      color: theme.textColor,
      fontSize: 16,
    },
    list_item: {
      color: theme.textColor,
      marginBottom: 10,
    },
    strong: {
      color: theme.textColor,
      fontWeight: 'bold',
    },
    em: {
      color: theme.textColor,
      fontStyle: 'italic',
    },
  };

  //Settings options with icons
  const settingsOptions = [
    { key: 'appearance', label: 'Appearance', icon: 'color-palette-outline', action: toggleTheme, rightText: isDarkMode ? 'Dark' : 'Light' },
    { key: 'sendFeedback', label: 'Send feedback', icon: 'chatbox-ellipses-outline', action: () => setFeedbackVisible(true) },
    { key: 'reportProblem', label: 'Report a Problem', icon: 'alert-circle-outline', action: () => setReportProblemVisible(true) },
    { key: 'rateUs', label: 'Rate Us', icon: 'star-outline', action: () => setRateUsVisible(true) },
    { key: 'aboutLegal', label: 'About & Legal', icon: 'information-circle-outline', action: () => setAboutLegalVisible(true) },
  ];

  //Render each setting option
  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.optionContainer, { backgroundColor: theme.backgroundColor }]} onPress={item.action}>
      <View style={styles.optionContent}>
        <Ionicons name={item.icon} size={24} color={theme.primaryColor} />
        <Text style={[styles.optionText, { color: theme.textColor }]}>{item.label}</Text>
      </View>
      {item.rightText && <Text style={[styles.rightText, { color: theme.secondaryColor }]}>{item.rightText}</Text>}
    </TouchableOpacity>
  );

  //Function to handle rating completion
  const handleRatingComplete = () => {
    setRateUsVisible(false);
    alert(`Thank you for rating us ${rating} stars!`);
  };

  //Function to handle feedback submission
  const handleFeedbackSubmit = () => {
    setFeedbackVisible(false);
    alert(`Thank you for your feedback: ${feedback}`);
    setFeedback('');
  };

  //Function to handle problem submission
  const handleProblemSubmit = () => {
    setReportProblemVisible(false);
    alert(`Thank you for reporting the problem: ${problem}`);
    setProblem('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.gridContainer}>
        <View style={[styles.gridItem, { backgroundColor: theme.primaryColor }]}>
          <Ionicons name="moon-outline" size={24} color={theme.headerTintColor} style={styles.gridItemIcon} />
          <Text style={[styles.gridItemText, { color: theme.headerTintColor }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? theme.primaryColor : '#f4f3f4'}
            trackColor={{ false: "#767577", true: theme.primaryColor }}
            style={styles.switch}
          />
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <FlatList
          data={settingsOptions}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <Modal
        visible={isRateUsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRateUsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Rate Us</Text>
            <StarRating
              rating={rating}
              onChange={setRating}
              color={theme.primaryColor}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setRateUsVisible(false)} color={theme.secondaryColor} />
              <Button title="Submit" onPress={handleRatingComplete} color={theme.primaryColor} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isFeedbackVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFeedbackVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Send Feedback</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.primaryColor, color: theme.textColor }]}
              placeholder="Enter your feedback"
              placeholderTextColor={theme.textColor}
              value={feedback}
              onChangeText={setFeedback}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setFeedbackVisible(false)} color={theme.secondaryColor} />
              <Button title="Submit" onPress={handleFeedbackSubmit} color={theme.primaryColor} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isReportProblemVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReportProblemVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Report a Problem</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.primaryColor, color: theme.textColor }]}
              placeholder="Describe the problem"
              placeholderTextColor={theme.textColor}
              value={problem}
              onChangeText={setProblem}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setReportProblemVisible(false)} color={theme.secondaryColor} />
              <Button title="Submit" onPress={handleProblemSubmit} color={theme.primaryColor} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAboutLegalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAboutLegalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>About & Legal</Text>
            <ScrollView style={styles.legalScrollView}>
            <Markdown style={markdownStyles}>{aboutAndLegalContent}</Markdown>
            </ScrollView>
            <View style={styles.modalButtonContainer}>
              <Button title="Close" onPress={() => setAboutLegalVisible(false)} color={theme.primaryColor} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  gridItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  switch: {
    marginTop: 10,
  },
  optionsContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rightText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  legalScrollView: {
    width: '100%',
    maxHeight: 600,
  },
  legalText: {
    fontSize: 14,
    marginBottom: 10,
  },
});


export default SettingsScreen;
