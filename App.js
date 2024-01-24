import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [amount, setAmount] = useState("Insert amount");
  const [exchangeRateData, setExchangeRateData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selected, setSelected] = useState();
  const [output, setOutput] = useState("Choose currency and insert amount.");

  var myHeaders = new Headers();
  myHeaders.append("apikey", "8hnduHihwQ8zdJ0PigX6rk4odjeJgMl8");

  const handleInputFieldClick = () => {
    if (amount === "Insert amount") {
      setAmount("");
      setOutput("Choose currency and insert amount.");
    }
  };

  useEffect(() => {
    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=EUR`, {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(Object.keys(data.rates));
        setExchangeRateData(data);
      })
      .catch((error) => Alert.alert("Error", error));
  }, []);

  const calculate = () => {
    var rate = exchangeRateData.rates[selected];
    var total = parseFloat(amount) / parseFloat(rate);
    Keyboard.dismiss();
    setOutput(`${amount} ${selected} is ${total.toFixed(2)} euros`);
  };

  const handleEmptyPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleEmptyPress}>
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOr5Th6pmAfvtKw1J-uoGGvarY3G4hNFIlTw&usqp=CAU",
          }}
          style={{
            width: "60%",
            height: 250,
            borderWidth: 5,
            borderColor: "black",
          }}
        />

        <View
          style={{
            width: "80%",
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Picker
            selectedValue={selected}
            onValueChange={(value, index) => setSelected(value)}
            style={{
              width: 200,
            }}
            mode="dialog"
          >
            {currencies.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
          <View style={{ width: "100%" }}>
            <TextInput
              style={{
                borderBottomWidth: 2,
                height: 30,
                width: "30%",
                marginTop: 30,
                marginLeft: 10,
              }}
              value={amount}
              onFocus={handleInputFieldClick}
              onChangeText={(text) => setAmount(parseInt(text))}
              keyboardType="numeric"
              type="number"
            />
            <Pressable
              onPress={calculate}
              style={{
                width: "30%",
                alignItems: "center",
                padding: 10,
                backgroundColor: "blue",
                marginTop: 100,
                marginLeft: 10,
              }}
            >
              <Text style={{ color: "white" }}>Convert</Text>
            </Pressable>
          </View>
        </View>

        <Text style={{ marginTop: 40, fontSize: 20 }}>{output}</Text>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 70,
  },
});
