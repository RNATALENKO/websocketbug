import React, {useState} from 'react';
import { useRef } from 'react';
import {Text, View, TextInput, FlatList, ScrollView} from 'react-native'
import { useEffect } from 'react/cjs/react.development';
import { Card } from '../Components/Card';
import {io} from 'socket.io-client';





//parent component
export const Screen1 = () =>{

    const [dataSet, setDataSet] = useState([]);
    const [dataBool, setDataBool] = useState(false);

    const socket = io('http://localhost:8080');

    //executes once on render
    useEffect(()=>{

        console.log('inside app twos useEffect');
        
        //get the updated set of data
        socket.emit('getPeople');
        socket.on('receiveAllPeople', (data)=>{
            setDataSet(data);
        })

        //listen for the trigger
        socket.on('trigger', ()=>{
            if(dataBool==false){
                setDataBool(true);
            }
            else{setDataBool(false)}
        })

        return ()=>[
            socket.close()
        ]
    
        
    },[dataBool])

  


    return(
        <ScrollView style={{width:'100%', padding:30}} scrollEnabled={true} scrollEventThrottle={1}>
                <FlatList data={dataSet}  keyExtractor={(item, index)=>'key:' + index} renderItem={(item,index)=>{
                   return( 
                       /* cards that need the updated search results */
                        <Card singleProject={item.item}
                        />
                    )
                }}></FlatList>
        </ScrollView>   
    )
}