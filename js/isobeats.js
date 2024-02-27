let isochronicBeatsSource; 

async function generateIsochronicBeats(audioContext, baseFrequency, durationSeconds, sampleRate) {
    const bufferSize = durationSeconds * sampleRate;
    const audioBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
    const audioDataLeft = audioBuffer.getChannelData(0);
    const audioDataRight = audioBuffer.getChannelData(1);
    
    const angularFrequency = baseFrequency * 2 * Math.PI;

    for (let i = 0; i < bufferSize; i++) {
        const time = i / sampleRate;
        const isochronicWave = Math.sin(angularFrequency * time);
        audioDataLeft[i] = isochronicWave;
        audioDataRight[i] = isochronicWave;
    }

    return audioBuffer;
}

async function isobeats() {
    const baseFrequency = 440; // Base frequency in Hz
    const durationSeconds = 10; // Duration of the isochronic beats in seconds
    const sampleRate = 44100; // Sample rate in Hz (standard for audio)

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await generateIsochronicBeats(audioContext, baseFrequency, durationSeconds, sampleRate);

    const isochronicBeatsSource = audioContext.createBufferSource();
    isochronicBeatsSource.buffer = audioBuffer;

    const isochronicGainNode = audioContext.createGain();
    isochronicGainNode.connect(audioContext.destination);
    isochronicGainNode.gain.value = 0.5; // Default volume

    isochronicBeatsSource.connect(isochronicGainNode);
    isochronicBeatsSource.start();
}


function stopIsochronic() {
    console.log('stopIsochronic');
    if (isochronicBeatsSource) {
        isochronicBeatsSource.stop();
    }
}
