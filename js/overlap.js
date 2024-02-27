let selectedAudioFile;

function handleAudioFile(file) {
    selectedAudioFile = file;
}

async function overlapAndPlay() {
    if (!selectedAudioFile) {
        alert('Please select an audio file.');
        return;
    }

    const baseFrequency = 440; // Base frequency in Hz
    const frequencyDifference = 5; // Frequency difference between the two ears in Hz
    const durationSeconds = 10; // Duration of the binaural beats in seconds
    const sampleRate = 44100; // Sample rate in Hz (standard for audio)

    const audioBuffer = await generateBinauralBeats(baseFrequency, frequencyDifference, durationSeconds, sampleRate);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const binauralBeatsSource = audioContext.createBufferSource();
    binauralBeatsSource.buffer = audioBuffer;

    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();

    const audioFileReader = new FileReader();
    audioFileReader.onload = async function () {
        const audioData = audioFileReader.result;
        const audioBuffer = await audioContext.decodeAudioData(audioData);

        const audioFileSource = audioContext.createBufferSource();
        audioFileSource.buffer = audioBuffer;

        audioFileSource.connect(gainNode1);
        binauralBeatsSource.connect(gainNode2);
        gainNode1.connect(audioContext.destination);
        gainNode2.connect(audioContext.destination);

        audioFileSource.start();
        binauralBeatsSource.start();
    };

    audioFileReader.readAsArrayBuffer(selectedAudioFile);
}