import React, { useState, useEffect } from 'react'

//  Stylings
import { View, ScrollView, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import normalize from 'react-native-normalize';
import colors from '../../../assets/colors/colors';
import { Dialog, Portal } from 'react-native-paper';

//  Navigation
import { useNavigation } from '@react-navigation/native';

// Redux
import { acceptGroupProposalAction, declineGroupProposalAction } from '../../redux/slices/groupSlices'
import { connect, useDispatch } from 'react-redux'

const ProposalList = ({ groupProposalList, groupList, socket }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [feedback, setFeedback] = useState("")
    const [proposalClicked, setProposalClicked] = useState(false);
    const [clickedProposal, setClickedProposal] = useState({
        Members: []
    });

    const renderItem = ({ item }) => {
        const group = groupList.find(x => x.id == item.groupId)
        return (
            <TouchableOpacity onPress={() => {
                setProposalClicked(true)
                console.log(group)
                setClickedProposal(group)
            }}
                style={{
                    width: normalize(350),
                    backgroundColor: colors.white,
                    borderRadius: normalize(10),
                    elevation: normalize(5),
                    margin: normalize(10)
                }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    margin: normalize(15)
                }}>
                    <View style={{
                        flexDirection: 'column'
                    }}>
                        <Text
                            style={{
                                fontFamily: 'Roboto-Bold',
                                fontSize: normalize(25)
                            }}>{group.topic}</Text>
                        <Text
                            style={{
                                fontFamily: 'Roboto-Regular',
                                fontSize: normalize(20)
                            }}>{group.name}</Text>
                    </View>
                    <View>
                        <View>
                            {item.progress == "ACCEPTED" ?
                                <Text style={{
                                    backgroundColor: '#5CCDFE',
                                    padding: normalize(7),
                                    elevation: normalize(5),
                                    borderRadius: normalize(5)
                                }}>ACCEPTED</Text>
                                : item.progress == "ON_REVIEW"
                                    ? <Text style={{
                                        backgroundColor: colors.darkYellow,
                                        padding: normalize(7),
                                        elevation: normalize(5),
                                        borderRadius: normalize(5)
                                    }}>PENDING</Text>
                                    : <Text style={{
                                        backgroundColor: '#FF3131',
                                        padding: normalize(7),
                                        elevation: normalize(5),
                                        borderRadius: normalize(5)
                                    }}>DECLINED</Text>}

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'
        }}>
            <FlatList
                nestedScrollEnabled={true}
                data={groupProposalList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Portal>
                <Dialog visible={proposalClicked} onDismiss={() => setProposalClicked(false)}>
                    <Dialog.Content stlye={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ScrollView nestedScrollEnabled={true}>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: normalize(30),
                                    textAlign: 'center'
                                }}
                            >GROUP PROPOSAL</Text>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: normalize(20),
                                    textAlign: 'center'
                                }}
                            >{clickedProposal.topic}</Text>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Regular',
                                    fontSize: normalize(20),
                                    textAlign: 'center'
                                }}
                            >
                                {clickedProposal.name}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Light',
                                    fontSize: normalize(20),
                                    textAlign: 'center'
                                }}
                            >
                                MEMBER: {clickedProposal.Members.length}/7
                        </Text>

                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: normalize(20),
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(20)
                                }}
                            >
                                Project Description:
                        </Text>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Light',
                                    fontSize: normalize(20),
                                }}
                            >
                                {clickedProposal.description}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    fontSize: normalize(20),
                                    borderBottomWidth: 0.5,
                                    marginTop: normalize(20)
                                }}
                            >
                                Feedback:
                        </Text>
                            <TextInput
                                placeholder="Write your feedback here..."
                                multiline={true}
                                value={clickedProposal.feedback}
                                onChangeText={(text) => setFeedback(text)}
                                style={{
                                    height: normalize(100)
                                }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(declineGroupProposalAction(clickedProposal.id, feedback, clickedProposal.Members, socket))
                                        setProposalClicked(false)
                                    }}
                                    style={{
                                        backgroundColor: colors.white,
                                        borderRadius: normalize(10),
                                        elevation: normalize(10),
                                        padding: normalize(15)
                                    }}>
                                    <Text style={{
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: normalize(18)
                                    }}>Decline</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(acceptGroupProposalAction(clickedProposal.id, feedback, clickedProposal.Members, socket))
                                        setProposalClicked(false)
                                    }}
                                    style={{
                                        backgroundColor: '#008BFF',
                                        borderRadius: normalize(10),
                                        elevation: normalize(10),
                                        padding: normalize(15)
                                    }}>
                                    <Text style={{
                                        fontFamily: 'Roboto-Bold',
                                        fontSize: normalize(18),
                                        color: colors.white
                                    }}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    )
}

const mapStateToProps = (state) => ({
    groupList: state.group.list
})

export default connect(mapStateToProps, null)(ProposalList)
