import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";


export function Coutdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext);

  // Converte o tempo do ciclo para segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  // Atualiza a contagem regressiva
  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        );

        // Finalização automática do ciclo
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId, setSecondsPassed, markCurrentCycleAsFinished]);

  // calcula quanto ainda falta
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  // Separa minutos e segundos restantes
  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmout = currentSeconds % 60;

  // Formata para sempre ter dois dígitos
  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmout).padStart(2, "0");

  //  Atualização do título da aba do navegador
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
