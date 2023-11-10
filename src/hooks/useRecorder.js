import { useCallback, useState } from "react";
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from "react-native-audio-recorder-player";
import appConfig from "../config/appConfig";
import { ios } from "../utility/size";

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useRecorder = chat => {
  const [recordTime, setRecordTime] = useState("00:00");
  const [recordSecs, setRecordSecs] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [recordView, setRecordView] = useState(false);
  const [pauseView, setPauseView] = useState(false);

  const onStartRecord = async () => {
    setRecordView(true);

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      ...(!chat && { OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS }),
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      AVModeIOS: AVModeIOSOption.videochat,
    };

    const fileName = `rishtaaunty${Date.now()}`;

    try {
      const path = Platform.select({
        ios: `${fileName}.aac`,
        android: `${appConfig.audioPath}/${fileName}.m4a`,
      });

      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordSecs(e.currentPosition);
        setRecordTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000))
        );
        setAudioUri(uri);
        return;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onPauseRecord = useCallback(async () => {
    try {
      await audioRecorderPlayer.pauseRecorder();
      setPauseView(true);
    } catch (err) {
      console.log("pauseRecord err", err);
    }
  }, []);

  const onResumeRecord = useCallback(async () => {
    await audioRecorderPlayer.resumeRecorder();
    setPauseView(false);
  }, []);

  const onStopRecord = useCallback(async () => {
    setPauseView(false);
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    setRecordTime("00:00");
    setRecordView(false);
  }, []);

  const onSendAudio = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    let audioFile = {
      name: ios ? "rishtaaunty-1234.aac" : "rishtaaunty-1234.m4a",
      type: `audio/${audioUri.split(".").pop()}`,
      uri: audioUri,
    };

    setRecordSecs(0);
    setRecordTime("00:00");
    setRecordView(false);
    return audioFile;
  };

  return {
    onStartRecord,
    onPauseRecord,
    onResumeRecord,
    onStopRecord,
    onSendAudio,
    recordTime,
    recordSecs,
    audioUri,
    setAudioUri,
    recordView,
    pauseView,
  };
};
