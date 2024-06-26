import { AttachmentIcon } from '@chakra-ui/icons'
import { Input, InputGroup, InputRightElement, Button, useToast, Img } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState, useMemo, MouseEventHandler } from 'react'
import ChatUsers from './Users';
import Image from 'next/image';
import { ChatUsersType, DefaultEventsMap, MessageType } from '@/types/Chat';
import { IRootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import chatService from '@/services/chatService';
import useFetch from '@/hooks/useFetch';
import { Socket, io } from 'socket.io-client';
import { setChatState } from '@/redux/chatSlice';
import moment from 'moment';
import imageService from '@/services/imageService';
import { GrDocumentPdf } from "react-icons/gr";
import { MdOutlineFileDownload } from 'react-icons/md';
import { downloadMedia } from '@/utils/downloadMedia';


export default function Chat() {
  const [msgs, setMsgs] = useState([] as MessageType[]);
  const [typedMsg, setTypedMsg] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatWith, setChatWith] = useState({} as ChatUsersType);
  const [conversationId, setConversationId] = useState<string>('');
  const {id, role} = useSelector((state: IRootState) => state.userStore.mainUser);
  const {lastChat, online} = useSelector((state: IRootState) => state.chatStore);
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: IRootState) => state.userStore?.mainUser);
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);


// scroll down
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [msgs]);

// only for users and doctors
const getAdminDetails = useCallback(() => {
  if(role!=='admin'){
    return chatService.getAdminDetails();
  }
  return Promise.resolve();
},[role]);

const {data: adminData} = useFetch(getAdminDetails);

useEffect(() => {
   adminData &&  setChatWith(adminData);
   !chatWith?.id && !adminData && lastChat && setChatWith(lastChat);
},[adminData]);


// setting up conversation
  useEffect(() => {
    const handleConversation = async () => {
      const payload = { senderId: id, receiverId: chatWith?.id };
      try {
        await chatService.addConversation(payload);
        const { _id } = await chatService.getConversation(payload);
        setConversationId(_id);
      } catch (error: any) {
        toast({
          title: error.response?.data?.message || 'An error occurred',
          position: 'top-right',
          status: 'error',
          isClosable: true,
        });
      }
    };
    if (chatWith?.id ) {
      handleConversation();
    }
  }, [chatWith, id]);

// get all msgs
  const getAllMessages = useCallback(() => {
    if(conversationId){
      return chatService.getMessage(conversationId);
    }
    return Promise.resolve([]);
  },[conversationId]);

  const {data, isLoading, isError} = useFetch(getAllMessages);
  useEffect(() => {setMsgs(data)}, [data]);

  // sending messages
  const sendMsg = async (type='text') => {
    if(typedMsg?.trim()=="" && type=='text') return;
    setTypedMsg("");
    const payload = {
      conversationId: conversationId,
      senderId: id,
      receiverId: chatWith?.id,
      text: type==='file' ? preSignedUrl.url.split('?')[0] : typedMsg,
      type,
      createdAt: `${new Date().toISOString()}`
    };
    setMsgs(prevMsgs => [...prevMsgs, payload]);


    try {
      await chatService.sendMessage(payload);
      socket?.current?.emit("sendMessage", payload);

    } catch (error: any) {
      toast({
        title: error.response?.data?.message || 'An error occurred',
        position: 'top-right',
        status: 'error',
        isClosable: true,
      });
    }
  };

  // send meg Keyboard
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        sendMsg();
    }
  };


// all realtime socket connections
  useEffect(()=>{
    socket.current = io('https://safeshot-socket.onrender.com');
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", users => {
     dispatch(setChatState({
      online: users,
      typing: [],
    }));
    
  });

  socket.current.on("getMessage",message => {
    setMsgs(prevMsgs => [...prevMsgs, message]);
});

    return () => {
      // Clean up: disconnect the socket when the component is unmounted
      if (socket.current) {
          socket.current.disconnect();
      }
  };
  },[user,msgs]);
  
// Showing is Online
const isOnline = () => {
  return online?.map((item: ChatUsersType)=>item.id).includes(chatWith?.id)
};

// setting up last chat
useEffect(()=>{
   chatWith?.id && dispatch(setChatState({ lastChat: chatWith }));
},[chatWith]);

// chat box header
const getHeader = useMemo(()=>(
    <>
          <div style={{ width: "10px", marginRight: '3px', border: isOnline() ? "1px solid green" 
            : "1px solid red", height: '9px', backgroundColor: isOnline() ? "green" : "red",
            borderColor: isOnline() ? "green" : "red", borderRadius: '50%' }}/>
         
          <Image
            width={10}
            height={10}
            className="rounded-full h-10 w-10 object-cover"
            src="https://tuk-cdn.s3.amazonaws.com/assets/components/horizontal_navigation/hn_2.png"
            alt="logo"
          />

          <div className='text-center font-bold pl-1'>
          {role == 'user' ? `${chatWith?.name} (Admin)` : chatWith?.name}
          </div>
    
    </>
)
,[chatWith, online, lastChat]);



  // getting presigned url
  const getPresignedUrl = useCallback(() => {
    if(selectedFile?.type) return imageService.getImageUrl(selectedFile.type);
    return Promise.resolve(null);
  }, [selectedFile]);

  const { data: preSignedUrl } = useFetch(getPresignedUrl);

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = event.target.files?.[0];
  setSelectedFile(selectedFile as File);
};

useEffect(()=>{
  const upload = async () => {
     await imageService.uploadImage({url:preSignedUrl?.url, type: selectedFile?.type as string, file: selectedFile as File});
      sendMsg('file');
      setSelectedFile(null);
  };
  if(selectedFile?.type && preSignedUrl) upload();
},[preSignedUrl]);


const getImage = (url: string) =>{
if(url.includes('.pdf')){
return (<div onClick={(e: any)=>downloadMedia(e,url)}>
        <GrDocumentPdf style={{color:' red', height:'100px', width:'200px'}} />
        <div className='flex center justify-between cursor-pointer pt-2'>
        <p>{url?.split('/')[3]}</p>
        <MdOutlineFileDownload style={{height:'30px', width:'30px'}} />
        </div>
       
      </div>)
};
return <Image height={500} width={500} src={url} alt='media' />
}


  return (
    <div style={{display:"flex",  height:'93vh'}}>
     
    {role==='admin' && <ChatUsers {...{ setChatWith}}/>} 


      {  (!chatWith?.id && role=='admin' && !lastChat) ? <p className="font-bold text-center text-4xl m-auto">Please Select A Chat!!</p> : 
       <div style={{width: role==='admin' ? '80%' : '100%', display:"flex", flexDirection:'column', justifyContent: 'space-between'}}>
          <div style={{height:'60px', padding:'20px 15px', display:'flex', alignItems:'center', backgroundColor:'blue', cursor:'pointer', margin:'1px 0px', background:'#effaff' }}>
                        
          {getHeader}   
                            
          </div>
        <div style={{overflowY:'scroll', marginLeft:'40px'}}>
          {
            !!msgs?.length && msgs?.map((msg, idx)=>{
              return  <div style={{ borderRadius:'5px', background:msg?.senderId === id ? 'lightGreen' : 'lightskyblue',
               marginRight:'40px', marginLeft: msg?.senderId === id ? "auto"  : undefined ,
               marginTop:'15px', marginBottom:'20px', maxWidth:'500px', padding:'24px'}} key={idx}
               >
             { msg.type==='text' ? <p className='font-bold'>{msg?.text}</p> : getImage(msg?.text as string) }
              <small className=' float-end font-semibold text-zinc-900 text-xs py-1'>{ moment(msg?.createdAt).format('YYYY-MM-DD') }</small>
              </div>

            })
          }
          <div ref={messagesEndRef} />
        </div>
        <div className='mx-2'>
            <InputGroup size='lg' style={{width:'98%'}}>
                <Input
                  value={typedMsg}
                  type={'text'}
                  placeholder='Type Message'
                  width={role=='user' ? "94%" :"92%"}
                  onChange={(e)=> setTypedMsg(e.target.value)}
                />
                <InputRightElement className='px-5' onClick={()=> fileRef.current && fileRef.current.click()}>
                <input
                  type='file'
                  id="fileInput"
                  ref={fileRef}
                  onChange={handleFileChange} 
                  className='hidden'
                />
                    <AttachmentIcon className=' cursor-pointer mr-2'/>
                    <Button size='lg' width={40} paddingX={10}
                     className='mr-14 ml-4 py-6 z-20' 
                     onClick={(e) => {e.stopPropagation(); sendMsg() as unknown as MouseEventHandler<HTMLButtonElement>}}
                     >
                      Send
                    </Button>
                </InputRightElement>
            </InputGroup>
        </div>
       </div>}
    </div>
  )
};
