import { RTCPeerConnection } from 'react-native-webrtc';

const peerConstraints = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export let peerConnection = new RTCPeerConnection(peerConstraints);