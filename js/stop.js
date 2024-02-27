function stop() {
    if (audioFileSource) {
        audioFileSource.stop();
    }
    if (binauralBeatsSource) {
        binauralBeatsSource.stop();
    }
    if (isochronicBeatsSource) {
        isochronicBeatsSource.stop();
    }
}