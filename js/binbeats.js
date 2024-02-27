let binauralBeatsSource; // Declare binauralBeatsSource globally
let binauralGainNode; // Declare binauralGainNode globally

async function generateBinauralBeats(baseFrequency, frequencyDifference, durationSeconds, sampleRate) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = durationSeconds * sampleRate;
    const audioBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
    const audioDataLeft = audioBuffer.getChannelData(0);
    const audioDataRight = audioBuffer.getChannelData(1);

    for (let i = 0; i < bufferSize; i++) {
        const time = i / sampleRate;
        const leftFrequency = baseFrequency * 2 * Math.PI;
        const rightFrequency = (baseFrequency + frequencyDifference) * 2 * Math.PI;
        audioDataLeft[i] = Math.sin(leftFrequency * time);
        audioDataRight[i] = Math.sin(rightFrequency * time);
    }

    return audioBuffer;
}

async function binbeats() {
    const baseFrequency = 220; // Base frequency in Hz
    const frequencyDifference = 20; // Frequency difference between the two ears in Hz
    const durationSeconds = 10; // Duration of the binaural beats in seconds
    const sampleRate = 44100; // Sample rate in Hz (standard for audio)

    const audioBuffer = await generateBinauralBeats(baseFrequency, frequencyDifference, durationSeconds, sampleRate);

    // Create audio source and gain node
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    binauralBeatsSource = audioContext.createBufferSource();
    binauralGainNode = audioContext.createGain();

    // Configure audio source and gain node
    binauralBeatsSource.buffer = audioBuffer;
    binauralBeatsSource.loop = true; // Loop the audio
    binauralGainNode.gain.value = 0.5; // Default volume

    // Connect nodes
    binauralBeatsSource.connect(binauralGainNode);
    binauralGainNode.connect(audioContext.destination);

    // Start playback
    binauralBeatsSource.start();

    // Convert audio buffer to a downloadable file
    const wavBlob = createWavBlob(audioBuffer);
    downloadBlob(wavBlob, "binaural_beats.wav");
}

function createWavBlob(audioBuffer) {
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    const interleaved = interleaveChannels(leftChannel, rightChannel);
    const sampleRate = audioBuffer.sampleRate;

    const wavData = new ArrayBuffer(44 + interleaved.length * 2);
    const view = new DataView(wavData);

    // Construct WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + interleaved.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // Write interleaved audio data
    for (let i = 0; i < interleaved.length; i++) {
        view.setInt16(44 + i * 2, interleaved[i] * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/wav' });
}

function interleaveChannels(leftChannel, rightChannel) {
    const interleaved = new Float32Array(leftChannel.length * 2);
    for (let i = 0; i < leftChannel.length; i++) {
        interleaved[i * 2] = leftChannel[i];
        interleaved[i * 2 + 1] = rightChannel[i];
    }
    return interleaved;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function setBinauralVolume(volume) {
    if (binauralGainNode) {
        binauralGainNode.gain.value = volume / 100;
    }
}

function stopBinaural() {
    if (binauralBeatsSource) {
        binauralBeatsSource.stop();
    } else {
        console.log('binauralBeatsSource is not defined');
    }
}
