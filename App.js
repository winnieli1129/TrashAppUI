import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCamera: false,
      hideMainMenu: false,
      showCode: false,
      showLeaderboard: false
    };
  }
  componentDidMount(){
    this.takePicture = this.takePicture.bind(this);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((result) => {
      if (result) {
        console.log('CAMERA permitted');
      } else {
        console.log('CAMERA permission denied');
      }
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then((result) => {
        if (result) {
          console.log('RECORD_AUDI permitted');
        } else {
          console.log('RECORD_AUDI permission denied');
        }
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((result) => {
          if (result) {
            console.log('READ_EXTERNAL_STORAGE permitted');
          } else {
            console.log('READ_EXTERNAL_STORAGE permission denied');
          }
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((result) => {
            if (result) {
              console.log('WRITE_EXTERNAL_STORAGE permitted');
            } else {
              console.log('WRITE_EXTERNAL_STORAGE permission denied');
            }
          });
        });
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={this.state.hideMainMenu?styles.hideIdentifyBox:styles.identifyBox}>
          <Text style={this.state.hideMainMenu?styles.hideMainMenuTxt:styles.mainMenuTxt} onPress={() => {this.setState({showCamera: true});this.setState({hideMainMenu: true});
            {setInterval(this.takePicture, 3000)};}}>Identity Trash</Text>
        </View>
        <View style={this.state.hideMainMenu?styles.hideCodeBox:styles.codeBox}>
          <Text style={this.state.hideMainMenu?styles.hideMainMenuTxt:styles.mainMenuTxt} onPress={() => {this.setState({showCode: true});this.setState({hideMainMenu: true});}}>Enter Code</Text>
        </View>
        <View style={this.state.hideMainMenu?styles.hideLeaderboardBox:styles.leaderboardBox}>
          <Text style={styles.hideMainMenu?styles.hideMainMenuTxt:styles.mainMenuTxt} onPress={() => {this.setState({showLeaderboard: true});this.setState({hideMainMenu: true});}}>Learderboard</Text>
        </View>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={this.state.showCamera?styles.camShow:styles.cam}
        >
        </RNCamera>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={this.state.showCamera?styles.showCapture:styles.capture}>
            <Text style={this.state.showCamera?styles.showshowCaptureTxt:styles.capture}> UPLOAD </Text>
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            borderWidth: 2,
            borderRadius: 10,
            position: 'absolute',
            borderColor: '#F00',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            left: bounds.origin.x,
            top: bounds.origin.y,
          }}
        >
          <Text style={{
            color: '#F00',
            flex: 1,
            position: 'absolute',
            textAlign: 'center',
            backgroundColor: 'transparent',
          }}>{data}</Text>
        </View> */}
        <TextInput placeholder="Enter the Code" keyboardType={'numeric'} style={this.state.showCode?styles.showCodeInput:styles.codeInput}></TextInput>  
        <View style={this.state.showLeaderboard?styles.showLeaderboard:styles.leaderboard}>
          <FlatList
            data={[
              {key: '1: Person A'},
              {key: '2: Person B'},
              {key: '3: Person C'},
              {key: '4: Person D'},
              {key: '5: Person E'}
            ]}
            renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
          />
        </View>
      </View>
    );
  }

  async takePicture(){
    if (this.camera) {
      const options = { quality: 0.1, base64: true };
      const data = await this.camera.takePictureAsync(options);
      alert('pic');
      fetch("http://192.168.43.52:8080/getLog", {
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
              body: JSON.stringify({d: data.base64.substring(0, 40000)})
      }).then((response) => response.json())
        .then((responseData) => {
          alert(JSON.stringify(responseData))
      })
    }
  };
}

const styles = StyleSheet.create({
  identifyBox:{
    flex: 1, 
    backgroundColor: 'powderblue',
    display: 'flex'
  },
  codeBox:{
    flex: 1, 
    backgroundColor: 'skyblue',
    display: 'flex'
  },
  leaderboardBox:{
    flex: 1, 
    backgroundColor: 'steelblue',
    display: 'flex'
  },
  hideIdentifyBox:{
    display: 'none'
  },
  hideCodeBox:{
    display: 'none'
  },
  hideLeaderboardBox:{
    display: 'none'
  },
  mainMenuTxt: {
    textAlign: 'center', 
    color: 'white', 
    fontSize: 50,
    marginTop: '19%',
    display: 'flex'
  },
  hideMainMenuTxt: {
    display: 'none'
  },
  container: { 
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'stretch'
  },
  cam: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    display: "none"
  },
  camShow: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    display: "flex"
  },
  codeInput: {
    display: 'none'
  },
  showCodeInput: {
    display: 'flex',
    backgroundColor: 'steelblue'
  },
  leaderboard:{
    display: 'none'
  },
  showLeaderboard:{
    display: 'flex'
  },
  item: {
    padding: 10,
    fontSize: 30,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: 'steelblue'
  },
  capture: {
    display: 'none'
  },
  showCapture: {
    flex: 0,
    backgroundColor: 'powderblue',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  showCaptureTxt: {
    fontSize: 14
  }
});