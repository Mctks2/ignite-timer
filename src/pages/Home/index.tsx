import { HandPalm, Play } from "phosphor-react";
import { Coutdown } from "./components/Coutdown";
import { NewCycleForm } from "./components/NewCycleForm";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";


import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./style";

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
  // Hooks do Contexto
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  // Hook de Formulário
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  // Destruturação do Formulário
  const { handleSubmit, watch, reset } = newCycleForm;

  // Recebe os dados do formulário
  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data); // Cria um novo ciclo
    reset(); // Limpa o formulário
  }

  // Verifica se o campo task está vazio para desativar o botão "Começar".
  const task = watch("task");
  const isSubmitDisabled = !task;

  // Conteúdo Visual
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Coutdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
