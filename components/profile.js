import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Image} from 'react-native';
import {Text, ListItem, Icon} from 'react-native-elements';
import Axios from 'axios';
import firebase from '../firebase';
import genericUserPic from '../assets/user.png';

export default class Profile extends Component{
    state = {
        user: {},
        currEvents: [],
        pastEvents: [],
    }

    componentDidMount(){
        const user = this.props.user;

        const p1 = Axios.get(`http://horizons-api.herokuapp.com/events/${user.id}`);
        const p2 = Axios.get(`http://horizons-api.herokuapp.com/events/past/${user.id}`);

        // const p1 = Axios.get(`http://localhost:5001/events/${user.id}`);
        // const p2 = Axios.get(`http://localhost:5001/events/past/${user.id}`);

        Promise.all([p1, p2])
            .then(([res1, res2]) =>{
                this.setState( {user, currEvents: res1.data.data, pastEvents: res2.data.data});
            })
            .catch(err =>{
                console.log('get user created events error...', err);
            })
    }

    render (){
        const {user, currEvents, pastEvents} = this.state;
        const profilePic = user.pic ? user.pic : genericUserPic;
        console.log('in render, user is...', user)
        console.log('in render, currEvents is...', currEvents)
        console.log('in render, pastEvents is...', pastEvents)

        return (
            <ScrollView>
            <KeyboardAvoidingView style={styles.container}>
                
                <View style={styles.profileContainer}>
                    <Image source={profilePic} style={styles.profileImg}/>
                    <Text h3 style={styles.username}> {user.username} </Text>
                    <Text style={styles.email}> {user.email} </Text>
                </View>

                <View style={styles.currEventsContainer}>
                    <Text style={styles.title}>Events Created For Today</Text>
                    <View>
                        {currEvents.length? 
                            currEvents.map( (l, i) =>(
                                <ListItem
                                key={i}
                                leftAvatar={{ source: { uri: l.logo } }}
                                title={l.name_}
                                subtitle={l.starts + l.venue}
                                />
                            ))
                            :
                            <Text style={styles.noEventText}>Create an event!</Text>
                        }
                    </View>
                </View>

                <View style={styles.pastEventsContainer}>
                    <Text style={styles.title}>Past Created Events</Text>
                    <ScrollView style={styles.pastEventsList}>
                        {pastEvents.length?
                            pastEvents.map( (l, i) =>(
                                <ListItem
                                    key={i}
                                    leftAvatar={{ source: { uri: l.logo } }}
                                    title={l.name_}
                                    subtitle={`${l.venue} - ${l.starts.split('T').join(' ').slice(0,-8)}`}
                                />
                            ))
                            :
                            <Text style={styles.noEventText}>No events created yet</Text>
                        }
                    </ScrollView>
                </View>


                {/* logout button */}
                <TouchableOpacity 
                    style={styles.logoutBtn}
                    onPress={()=>{firebase.auth().signOut()}}
                >
                    <Text style={styles.logoutText}>
                        Log Out
                    </Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        
    },
    profileContainer: {
        marginTop: 25,
        paddingBottom: 20,
    },
    profileImg: {
        width: 125,
        height: 125,
        alignSelf: 'center',
    },
    username: {
        marginTop: 10,
        color: 'black',
        textAlign: 'center'
    },
    email: {
        textAlign: 'center',
        color: 'grey'
    },
    logoutBtn: {
        backgroundColor: 'grey',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 15
    },
    logoutText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16
    },
    currEventsContainer: {
        paddingBottom: 20,
    },
    title: {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'black',
        paddingVertical: 10,
        fontWeight: '700',
        fontSize: 20,
    },
    pastEventsContainer: {
        paddingBottom: 20,
    },
    noEventText: {
        textAlign: 'center'
    },
    pastEventsList: {

    }
});