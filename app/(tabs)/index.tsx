import { StyleSheet, Text, SafeAreaView, View, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { theme } from '../../theme';

export default function HomeScreen() {
  const [timerKey, setTimerKey] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURI, setAudioURI] = useState<string | null>(null);
  const sound = useRef(new Audio.Sound());

  const handleTimerComplete = () => {
    playAudio(); // Executa a função assíncrona que toca o áudio
  };

  const playAudio = async () => {
    try {
      if (audioURI) {
        // Se o usuário escolheu um áudio, tocá-lo
        await sound.current.unloadAsync(); // Descarregar som anterior
        await sound.current.loadAsync({ uri: audioURI });
      } else {
        // Caso contrário, tocar um som padrão
        await sound.current.unloadAsync();
        await sound.current.loadAsync(require('../../assets/3min.m4a')); // Som padrão
      }
      await sound.current.playAsync();
    } catch (error) {
      console.log('Erro ao tocar o áudio:', error);
    }
  };

  const pickAudio = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*', // Filtrar para apenas arquivos de áudio
    });

    // Verificar se o documento foi selecionado com sucesso e acessar `assets`
    if (result.assets && result.assets.length > 0) {
      setAudioURI(result.assets[0].uri); // Acessar o primeiro item dentro de assets e pegar o URI
    } else {
      console.log('Nenhum arquivo foi selecionado');
    }
  };

  const formatTime = (remainingTime: number) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  const addTime = (seconds: number) => {
    setTotalDuration((prev) => prev + seconds); // Soma o tempo selecionado à duração total
  };

  const startPauseTimer = () => {
    setIsPlaying((prev) => !prev); // Alterna entre iniciar e pausar o temporizador
  };

  const resetTimer = () => {
    setIsPlaying(false); // Pausa o temporizador
    setTotalDuration(0); // Reseta o tempo para 0
    setTimerKey((prev) => prev + 1); // Reseta o temporizador visualmente
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerTemper}>
        <Text style={styles.title1}>Olá Bruno !</Text>
        <Text style={styles.title2}>Controle de Tempo</Text>
        <Text style={styles.title2}>Personalizado</Text>

        <View style={styles.containerTemperLive}>
          <Text style={styles.title3}>Tempo Total: {formatTime(totalDuration)}</Text>
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={isPlaying}
            duration={totalDuration}
            colors="#9F43CC"
            onComplete={handleTimerComplete} // Função síncrona passada aqui
          >
            {({ remainingTime }) => (
              <Text style={styles.title3}>{formatTime(remainingTime)}</Text> // Exibir o tempo formatado
            )}
          </CountdownCircleTimer>
        </View>
      </View>

      <View style={styles.containerMain}>
        <View style={styles.containersButtons}>
          <View style={styles.containerButtons}>
            <Pressable style={styles.buttonsAddTimer} onPress={() => addTime(180)}>
              <Text style={styles.text}>Add 3 Minutos</Text>
            </Pressable>
            <Pressable style={styles.buttonsAddTimer} onPress={() => addTime(300)}>
              <Text style={styles.text}>Add 5 Minutos</Text>
            </Pressable>
          </View>
          <View style={styles.containerButtons}>
            <Pressable style={styles.buttonsAddTimer} onPress={() => addTime(600)}>
              <Text style={styles.text}>Add 10 Minutos</Text>
            </Pressable>
            <Pressable style={styles.buttonsAddTimer} onPress={() => addTime(900)}>
              <Text style={styles.text}>Add 15 Minutos</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.containerButtonAction}>
          <Pressable
            onPress={startPauseTimer}
            disabled={totalDuration === 0}
            style={styles.buttonsActions}
          >
            <Text style={styles.textButtonsActions}>
              {isPlaying ? 'Pausar Temporizador' : 'Iniciar Temporizador'}
            </Text>
          </Pressable>

          <Pressable
            onPress={resetTimer}
            disabled={totalDuration === 0}
            style={styles.buttonsActions}
          >
            <Text style={styles.textButtonsActions}>Resetar Temporizador</Text>
          </Pressable>

          <Pressable onPress={pickAudio} style={styles.buttonsActions}>
            <Text style={styles.textButtonsActions}>Escolher Áudio</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 50,
    backgroundColor: '#000',
  },
  containerMain: {
    backgroundColor: '#fff',
    color: theme.colors.white,
    flex: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 40,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  containerTemper: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 50,
  },
  containerTemperLive: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title1: {
    fontSize: 18,
    color: theme.colors.white,
  },
  title2: {
    fontSize: 25,
    color: theme.colors.white,
  },
  title3: {
    marginVertical: 10,
    color: theme.colors.white,
  },
  containersButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  containerButtons: {
    gap: 8,
  },
  containerButtonAction: {
    marginTop: 40,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsAddTimer: {
    width: 170,
    backgroundColor: theme.colors.roxo[1],
    borderRadius: 20,
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: theme.colors.white,
    textAlign: 'center',
  },
  textButtonsActions: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: 'center',
  },
  buttonsActions: {
    width: 250,
    height: 35,
    borderRadius: 10,
    padding: 4,
    borderColor: theme.colors.black,
    borderWidth: 1,
  },
});
