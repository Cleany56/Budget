import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const cardWidth = Dimensions.get('window').width - 40; // match HomeScreen horizontal padding

const cards = [
  {
    title: 'Spending',
    desc: 'Your spending for the month',
    amount: '-$1,234.56',
  },
  {
    title: 'Net Worth',
    desc: 'Your net worth is $45,678.90.',
  },
];




const StatSwitcher: React.FC = () => {
  const [index, setIndex] = useState(0);
  const { colors } = useTheme();
  const handlePrev = () => setIndex(i => (i > 0 ? i - 1 : 0));
  const handleNext = () => setIndex(i => (i < cards.length - 1 ? i + 1 : i));

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card }] }>
        {index === 0 ? (
          <>
            <Text style={[styles.spendingDesc, { color: colors.text }]}>{cards[0].desc}</Text>
            <Text style={styles.spendingAmount}>{cards[0].amount}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{cards[1].title}</Text>
            <Text style={[styles.cardDesc, { color: colors.text }]}>{cards[1].desc}</Text>
          </>
        )}
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
    minHeight: 140,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
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
  spendingDesc: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  spendingAmount: {
    fontSize: 28,
    color: '#e17055',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default StatSwitcher;
