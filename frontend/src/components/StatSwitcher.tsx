import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const cardWidth = Dimensions.get('window').width - 40; // match HomeScreen horizontal padding

const cards = [
  { title: 'Spending', desc: 'Your spending for the week is $1,234.56.' },
  { title: 'Investments', desc: 'Your investments grew by 3% this month.' },
  { title: 'Net Worth', desc: 'Your net worth is $45,678.90.' },
];

const StatSwitcher: React.FC = () => {
  const [index, setIndex] = useState(0);
  const handlePrev = () => setIndex(i => (i > 0 ? i - 1 : 0));
  const handleNext = () => setIndex(i => (i < cards.length - 1 ? i + 1 : i));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cards[index].title}</Text>
        <Text style={styles.cardDesc}>{cards[index].desc}</Text>
        <View style={styles.arrowRow}>
          {index > 0 && (
            <TouchableOpacity onPress={handlePrev} style={styles.arrowButton} accessibilityLabel="Previous card">
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {index < cards.length - 1 && (
            <TouchableOpacity onPress={handleNext} style={styles.arrowButton} accessibilityLabel="Next card">
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f4f4f7',
    borderRadius: 16,
    padding: 20,
    width: cardWidth,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 8,
  },
  arrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 22,
    color: '#444',
    fontWeight: 'bold',
  },
});

export default StatSwitcher;
