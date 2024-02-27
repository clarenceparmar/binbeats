async function playAudio() {
            
    // Load the audio file (replace 'audio-file.wav' with your audio file path)
    const audioFileResponse = await fetch('./rain.mp3');
    const audioFileArrayBuffer = await audioFileResponse.arrayBuffer();
    const audioFileBuffer = await audioContext.decodeAudioData(audioFileArrayBuffer);

    audioFileSource = audioContext.createBufferSource();
    audioFileSource.buffer = audioFileBuffer;

    audioGainNode = audioContext.createGain();
    audioGainNode.connect(audioContext.destination);
    audioGainNode.gain.value = 0.5; // Default volume

    audioFileSource.connect(audioGainNode);
    audioFileSource.start();
}

function setAudioVolume(volume) {
    if (audioGainNode) {
        audioGainNode.gain.value = volume / 100;
    }
}