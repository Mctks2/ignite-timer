import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";
import { Coutdown } from "./components/Coutdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FormProvider, useForm } from "react-hook-form";

// Criação do Schema
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./style";

//Estrutura do ciclo
interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

// Validação do Formulário
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser de no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos"),
});

 // Tipagem com validação em Zod
 type NewCycleFormData = Zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0); // Quantos segundos se passaram

  // Hook de Formulário
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  // Destructuring do Formulário
  const { handleSubmit, watch, reset } = newCycleForm;

  // Cálculos de tempo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Encontra o ciclo ativo

  function setSecondsPassed(seconds: number){
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

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

  // Verifica se o campo task está vazio para desativar o botão "Começar".
  const task = watch("task");
  const isSubmitDisabled = !task;

  console.log(cycles);

  // Conteúdo Visual
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Coutdown />
        </CyclesContext.Provider>

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
