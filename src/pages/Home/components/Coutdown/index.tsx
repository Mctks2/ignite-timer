import { useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";

export function Coutdown() {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0); // Quantos segundos se passaram

    // Converte o tempo do ciclo para segundos
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    // Atualiza a contagem regressiva
  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        // Finalização automática do ciclo
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          setAmountSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

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
