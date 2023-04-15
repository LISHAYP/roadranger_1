import React, { useState } from 'react';
import { View, Modal, TextInput, Button, FlatList, Text } from 'react-native';

const SearchPopup = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    country: '',
    city: '',
    type: '',
    date: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(`your-api-url/search?country=${searchCriteria.country}&city=${searchCriteria.city}&type=${searchCriteria.type}&date=${searchCriteria.date}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Modal visible={modalVisible} animationType="slide">
        <View>
          <TextInput
            placeholder="Country"
            onChangeText={(text) =>
              setSearchCriteria((prevState) => ({
                ...prevState,
                country: text
              }))
            }
          />
          <TextInput
            placeholder="City"
            onChangeText={(text) =>
              setSearchCriteria((prevState) => ({
                ...prevState,
                city: text
              }))
            }
          />
          <TextInput
            placeholder="Type"
            onChangeText={(text) =>
              setSearchCriteria((prevState) => ({
                ...prevState,
                type: text
              }))
            }
          />
          <TextInput
            placeholder="Date"
            onChangeText={(text) =>
              setSearchCriteria((prevState) => ({
                ...prevState,
                date: text
              }))
            }
          />
          <Button title="Search" onPress={handleSearch} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <Button title="Open Search" onPress={() => setModalVisible(true)} />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default SearchPopup;
