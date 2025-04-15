import { HandPalm, Play } from "phosphor-react";
import { useEffect, useState } from "react";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./style";
import { NewCycleForm } from "./components/NewCycleForm";
import { Coutdown } from "./components/Coutdown";

//Estrutura do ciclo
interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  // Cálculos de tempo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Encontra o ciclo ativo

  // Função de criação de novo ciclo
  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]); //adiciona o novo ciclo
    setActiveCycleId(id); //seta o ciclo ativo
    setAmountSecondsPassed(0);

    reset();
  }

  // Interrompe o ciclo atual
  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

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

  // Verifica se o campo task está vazio para desativar o botão "Começar".
  const task = watch("task");
  const isSubmitDisabled = !task;

  console.log(cycles);

  // Conteúdo Visual
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <Coutdown />

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
