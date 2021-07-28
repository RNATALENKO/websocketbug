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


    const socketRef = useRef();

    //executes once on render
    useEffect(()=>{

        console.log('inside app twos useEffect');

        const socket = io('http://localhost:8080');
        socketRef.current = socket; 

        socket.emit('getPeople');
    
        return ()=>{
            socket.close()
        }
        
    },[])


    useEffect(()=>{

        console.log('inside app twos 2nd useEffect');
       
        socketRef.current.emit('getPeople');

        //get the updated set of data
        socketRef.current.on('receiveAllPeople', (data)=>{
            setDataSet(data);
        })
      
    
        socketRef.current.on('trigger', (data)=>{
            if(dataBool){
                setDataBool(false)
            }
            else{
                setDataBool(true);
            }
        })
        
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