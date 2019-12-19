import React from 'react';
import Reflux from 'reflux';

//数据流
import AppActions from 'actions/AppActions';
import ChatroomStore from 'stores/chatroomStore';

import { Widget,addResponseMessage,renderCustomComponent,dropMessages,addUserMessage  } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

class ChatRoom extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store=ChatroomStore;
    }

    componentDidMount(){
        const {plantInfo,user}=this.props;
        //renderCustomComponent(<Button />);
        console.log("chat room mount");
        //this.loadInitialMessages(plantInfo,user);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.plantInfo.id!=nextProps.plantInfo.id||this.props.lastMessage!=nextProps.lastMessage){

            this.loadInitialMessages(nextProps.plantInfo,nextProps.user);
        }
    }

    loadInitialMessages=(plantInfo,user)=>{

        AppActions.GetInitialMessages({
            plantId:plantInfo.id,
            timeStart:(new Date().getTime()-24*60*60*1000)/1000
        },(messages)=>{
            //console.log(messages);
            dropMessages();
            messages.forEach((msg)=>{
                if(msg.user==user.id){
                    addUserMessage("["+new Date(msg.time*1000)+"] "+msg.text);
                }
                else{
                    addResponseMessage(msg.account+" ["+new Date(msg.time*1000)+"] "+ msg.text);
                }

            });
        });
    }


    handleNewUserMessage = (newMessage) => {
        const {plantInfo,user}=this.props;
        //console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        //addResponseMessage("Hello");
        AppActions.AddNewMessage({
                msg:newMessage,
                userId:user.id,
                plantId:plantInfo.id
        },()=>{
            //dropMessages();
            this.loadInitialMessages(plantInfo,user);
        });
    }


    render(){
        const {plantInfo,user,lastMessage}=this.props;
        //console.log(lastMessage);
        return (

            <Widget
                title={plantInfo.nameCN}
                subtitle={user.account}
                handleNewUserMessage={this.handleNewUserMessage}
                badge={0}
            />

        );
    }
}
export default ChatRoom;