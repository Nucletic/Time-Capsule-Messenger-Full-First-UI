import { Pressable, StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Height, Width } from '../../utils'
import { moderateScale } from 'react-native-size-matters'
import { Calendar } from 'react-native-calendars';

const SelectTime = ({ selectedTime, setSelectedTime }) => {

  const [selectedDate, setSelectedDate] = useState('');
  const [openTimeMeridien, setOpenTimeMeridiem] = useState(false);
  const [selectedTimeMeridiem, setSelectedTimeMeridiem] = useState('AM');
  const [Time, setTime] = useState('');
  const clearSelectedDate = () => {
    setSelectedDate('');
    setTime('');
  };

  const handleSetTime = (text) => {
    setTime(text.length === 2 ? text + ':' : text);
  };

  useEffect(() => {
    const updatedTime = { time: Time, date: selectedDate, meridian: selectedTimeMeridiem };
    setSelectedTime(updatedTime);
  }, [Time, selectedTimeMeridiem, selectedDate])




  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Select Time</Text>
      <View style={styles.Calender}>
        <Calendar style={{ borderTopLeftRadius: moderateScale(20), borderTopRightRadius: moderateScale(20) }}
          dayComponent={(props) => <DayComponent {...props} selectedDate={selectedDate} onPress={(day) => setSelectedDate(day.dateString)} />}
          theme={{
            textSectionTitleColor: '#9095A0',
            textDayHeaderFontWeight: '700',
          }} renderHeader={CustomHeader}
          renderArrow={CustomArrow}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' },
          }}
        />
        <View style={styles.ClearTimeView}>
          <View style={styles.Divider} />
          <Pressable onPress={clearSelectedDate} style={styles.ClearTimeButton}>
            <Text style={styles.ClearTimeButtonText}>Clear</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.SelectTime}>
        <Text style={styles.Title}>Time</Text>
        <View style={styles.SelectTimeInputView}>
          <TextInput style={styles.SelectTimeInput} keyboardType='numeric' value={Time} onChangeText={handleSetTime}
            placeholder='00:00' maxLength={5} placeholderTextColor={'#9095A0'} />
          <Pressable onPress={() => { setOpenTimeMeridiem(!openTimeMeridien) }} style={styles.SelectTimeMeridiem}>
            <Text style={styles.SelectTimeMeridiemText}>{selectedTimeMeridiem}</Text>
            <Image source={require('../../assets/Icons/MeridiemDown.png')} style={styles.SelectTimeMeridiemIcon} />
            {openTimeMeridien &&
              <View style={styles.TimeMeridiemDropDown}>
                <Pressable onPress={() => { setOpenTimeMeridiem(false); setSelectedTimeMeridiem('AM') }} style={styles.TimeMeridiemDropDownButton}>
                  <Text style={styles.SelectTimeMeridiemText}>AM</Text>
                </Pressable>
                <Pressable onPress={() => { setOpenTimeMeridiem(false); setSelectedTimeMeridiem('PM') }} style={styles.TimeMeridiemDropDownButton}>
                  <Text style={styles.SelectTimeMeridiemText}>PM</Text>
                </Pressable>
              </View>}
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const CustomArrow = (direction) => {
  return (
    <>
      {direction === 'left' ? (
        <Pressable style={styles.CustomArrowButton}>
          <Image source={require('../../assets/Icons/CalenderLeft.png')} style={styles.CustomArrowButtonImage} />
        </Pressable>
      ) : (
        <Pressable style={styles.CustomArrowButton}>
          <Image source={require('../../assets/Icons/CalenderRight.png')} style={styles.CustomArrowButtonImage} />
        </Pressable>
      )}
    </>
  )
};


const CustomHeader = (date) => {

  const [currentMonth, setCurrentMonth] = useState(null);
  useEffect(() => {
    if (date) {
      const currentDate = new Date(date);
      const options = { year: 'numeric', month: 'long' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
      setCurrentMonth(formattedDate);
    }
  }, [date])

  return (
    <Text style={styles.CalenderTitleText}>
      {currentMonth && currentMonth}
    </Text>
  )
}

const DayComponent = ({ date, state, onPress, selectedDate }) => {
  const isSelected = date.dateString === selectedDate;

  return (
    <Pressable style={[styles.DayButton, isSelected && {
      position: 'absolute',
      backgroundColor: '#F7706E',
      height: moderateScale(28),
      width: moderateScale(28),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(4),
    }]} onPress={() => onPress(date)}>
      <Text style={[styles.DayText, { color: state === 'disabled' ? '#E0E0E0' : '#49505B' },
      isSelected && { color: 'white' }, // Adjust the styling as needed
      ]}>
        {date.day}
      </Text>
    </Pressable>
  );
};

export default SelectTime

const styles = StyleSheet.create({
  Container: {
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(21),
  },
  Title: {
    fontSize: Height * 0.016,
    color: '#49505B',
    fontWeight: '900',
  },
  Calender: {
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    shadowColor: "#c9c9c9",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  Divider: {
    backgroundColor: '#E9E9E9',
    height: moderateScale(1),
  },
  ClearTimeView: {
    backgroundColor: '#fff',
    paddingTop: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
  },
  ClearTimeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(80),
    height: moderateScale(35),
    backgroundColor: '#EFEFEF',
    borderRadius: moderateScale(10),
    marginTop: moderateScale(12),
    alignSelf: 'flex-end',
  },
  ClearTimeButtonText: {
    fontSize: Height * 0.02,
    fontWeight: '700',
    color: '#49505B',
  },
  DayButton: {
    paddingVertical: moderateScale(3),
    paddingHorizontal: moderateScale(5),
  },
  DayText: {
    fontSize: Height * 0.016,
    fontWeight: '700',
  },
  CalenderTitleText: {
    fontSize: Height * 0.020,
    color: '#49505B',
    fontWeight: '900',
  },
  CustomArrowButton: {
    borderWidth: moderateScale(1),
    borderColor: '#C3C3C3',
    borderRadius: moderateScale(100),
    height: moderateScale(32),
    width: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  CustomArrowButtonImage: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
  SelectTime: {
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(12),
    // shadowColor: "#c9c9c9",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.17,
    // shadowRadius: 3.05,
    // elevation: 4,
  },
  SelectTimeInputView: {
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  SelectTimeInput: {
    fontWeight: '700',
    fontSize: Height * 0.018,
    color: '#49505B',
    width: '60%',
    height: '100%',
  },
  SelectTimeMeridiem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(4),
  },
  SelectTimeMeridiemText: {
    fontWeight: '700',
    fontSize: Height * 0.018,
    color: '#49505B',
  },
  SelectTimeMeridiemIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  TimeMeridiemDropDown: {
    position: 'absolute',
    top: -11,
    left: -5,
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
  },
  TimeMeridiemDropDownButton: {
    height: moderateScale(35),
    width: moderateScale(65),
    alignItems: 'center',
    justifyContent: 'center',
  }
});