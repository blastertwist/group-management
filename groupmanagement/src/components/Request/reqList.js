import React, { useState, useEffect } from 'react'

// Stylings
import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import normalize from 'react-native-normalize'
import colors from '../../../assets/colors/colors'
import { Dialog, Portal, Button, Provider } from 'react-native-paper';

import Req from './req'

//Redux
import { connect, useDispatch } from 'react-redux'
import {
    getOwnGroupAction,
    getOwnJoinRequestAction,
    getJoinGroupReqAction
} from '../../redux/slices/groupSlices'

//passing
const ReqList = ({ joinList, owner }) => {
    const dispatch = useDispatch()

    const [visible, setVisible] = useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    useEffect(() => {
        dispatch(getJoinGroupReqAction())
    }, [])
    const [clickedUser, setClickedUser] = useState({});
    const renderItemR = ({ item }) => {

        return <Req
            key={item.id}
            id={item.id}
            firstName={item.applicant.profile.firstName}
            lastName={item.applicant.profile.lastName}
            studentId={item.applicant.studentId}
            approved={item.approved}
            confirm={item.confirm}
            clickedUser={() => {
                setClickedUser(item)
                showDialog()
            }}
        />
    }
    return (
        <>
            {owner ?
                <View style={styles.reqList}>
                    {joinList.length == 0 ? <Text>No Request</Text> :
                        <FlatList
                            nestedScrollEnabled={true}
                            data={joinList}
                            keyExtractor={item => item.id}
                            renderItem={renderItemR}
                        />}
                </View>
                :
                <View style={{
                    marginTop: normalize(50),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                }}>
                    <Image source={require('../../../assets/images/Humans1.png')} />
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: normalize(30),
                            textAlign: 'center',
                            color: colors.textMedium
                        }}
                    >YOU ARE NOT THE GROUP OWNER</Text>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Regular',
                            fontSize: normalize(18),
                            textAlign: 'center',
                            color: colors.textMedium
                        }}
                    >PLEASE CONTACT YOUR GROUP OWNER TO ACCEPT THE JOIN REQUEST</Text>
                </View>
            }

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>User Details</Dialog.Title>
                    <Dialog.Content>
                        <Text style={styles.textHead}>Name:</Text>
                        <Text style={styles.textReg}>{clickedUser.applicant.profile.firstName} {clickedUser.applicant.profile.lastName}</Text>
                        <Text style={styles.textHead}>Student ID:</Text>
                        <Text style={styles.textReg}>{clickedUser.applicant.studentId}</Text>
                        <Text style={styles.textHead}>Major:</Text>
                        <Text style={styles.textReg}>{clickedUser.applicant.profile.major}</Text>
                        <Text style={styles.textHead}>Description:</Text>
                        <Text style={styles.textReg}>{clickedUser.applicant.profile.biograph}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}


const styles = StyleSheet.create({
    reqList: {
        backgroundColor: colors.white
    },
    modal: {
        flex: 1,
        backgroundColor: colors.white,
        height: normalize(300),
        width: '100%'
    },
    textHead: {
        fontFamily: 'Roboto-Bold',
        fontSize: normalize(18)
    },
    textReg: {
        fontFamily: 'Roboto-Regular',
        fontSize: normalize(18)
    }
})
const mapStateToProps = (state) => ({
    joinList: state.group.joinGroupRequest
})

export default connect(mapStateToProps, null)(ReqList)


