import { useEffect, useRef, useState } from "react";

export default function useAudioReactive(audioUrl) {
  const [amplitude, setAmplitude] = useState(0);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audioRef.current = audio;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    const update = () => {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      const avg = sum / bufferLength;
      setAmplitude(avg / 255);

      requestAnimationFrame(update);
    };

    update();

    return () => {
      audio.pause();
      ctx.close();
    };
  }, [audioUrl]);

  const play = () => audioRef.current?.play();
  const pause = () => audioRef.current?.pause();

  return { amplitude, play, pause };
}