import React, {useState, useRef} from 'react';
import {Text, View, TextInput, FlatList, ScrollView, TouchableOpacity} from 'react-native'
import { useEffect } from 'react/cjs/react.development';
import { Card } from '../Components/Card';
import {io} from 'socket.io-client';
import { TEST_ACTION } from '../Redux/TestActions';
import { useDispatch } from 'react-redux';







export const Screen1 = () =>{

    const [dataSet, setDataSet] = useState([]);

    const socketRef = useRef(); 

    useEffect(()=>{

        const socket = io('http://localhost:8080');
        socketRef.current = socket; 

        return ()=>{
            socket.close();
        }
    },[])


    return(
        <ScrollView style={{width:'100%', padding:30}} scrollEnabled={true} scrollEventThrottle={1}>


                <TouchableOpacity style={{backgroundColor:'blue', padding:10, marginBottom:10}} onPress={()=>{
                    const date = new Date(); 

                    //a new person 
                    let person = {
                        name:'Greg',
                        age:19,
                        timestamp:100000000,
                    }

                    //update the ui (but this creates a new connection in the server)
                    setDataSet([...dataSet,person]);
                    
                    //emit the person to the server
                    socketRef.current.emit('addPerson', person);

                    

                }}>
                    <Text style={{color:'white'}}> Add a person </Text>

                </TouchableOpacity>


                <FlatList data={dataSet}  keyExtractor={(item, index)=>'key:' + index} renderItem={(item,index)=>{

                   return( 
                       /* cards that need the updated search results */
                        <Card 
                        singleProject={item.item} 
                        dataSet={dataSet} 
                        />
                    )
                }}></FlatList>



        </ScrollView>   
    )
}